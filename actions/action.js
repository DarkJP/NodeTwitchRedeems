const obsController = require('../controllers/obs.js');
const obs = obsController.ws;
const keywordController = require('../keywords/keywordController.js');
const commandFactory = require('../commands/commandFactory.js');

module.exports = class newAction {

    static async filterAsync(arr, predicate) {
        return Promise.all(arr.map(predicate)).then((results) => arr.filter((_v, index) => results[index]));
    }

    constructor(name, targetSources, commands, needsVisibleSources, incompatibilities) {
        this.name = name;
        this.targetSources = targetSources;
        this.commands = commands;
        this.needsVisibleSources = needsVisibleSources;
        this.incompatibilities = incompatibilities;
    }

    static loadFromData(data) {
        let name = data.name ?? '';
        let targetSources = data.targetSources ?? [];
        let commands = data.commands ?? [];
        let needsVisibleSources = data.needsVisibleSources ?? true;
        let incompatibilities = data.incompatibilities ?? [];
        return new newAction(name, targetSources, commands,
                             needsVisibleSources, incompatibilities);
    }

    async execute() {
        try {
            if (this.targetSources.length != 0) {

                if (!(await this.isOneTargetSourcePresent(this.targetSources))) {
                    return { msg: 'None of the specified sources are present.' };

                } else {

                    if (this.needsVisibleSources) {
                        let visibleSources = await this.findVisibleSources(this.targetSources);

                        if (visibleSources.length == 0) {
                            return { msg: `No visible sources for '${this.name}'.` };
                        }

                        /* Trigger simultaneously the action on each visible target sources */
                        await Promise.all(visibleSources.map(async (source) => {
                            let commands = await this.getCommandList(source);
                            for (let com of commands) {
                                if (com?.sourceName == '$targets') com.sourceName = source;
                                await com.execute();
                            }
                        }));
                        return { msg: `'${this.name}' done.` };

                    } else {

                        /* Trigger simultaneously the action on each target sources */
                        await Promise.all(this.targetSources.map(async (source) => {
                            let commands = await this.getCommandList(source);
                            for (let com of commands) {
                                if (com?.sourceName == '$targets') com.sourceName = source;
                                await com.execute();
                            }
                        }));
                        return { msg: `'${this.name}' done.` };
                    }
                }
            }

            /* If no target source is specified */
            let commands = await this.getCommandList();
            for (let com of commands) {
                await com.execute();
            }
            return { msg: `'${this.name}' done.` };

        } catch (err) {
            console.log(`Error from action '${this.name}': ${err.message}`);
        }
    }

    /* Returns true if at least one source specified in targetSources is present */
    async isOneTargetSourcePresent(targetSources) {
        let currentSceneName = (await obs.call('GetCurrentProgramScene')).currentProgramSceneName;
        let currSceneSources = await obs.call('GetSceneItemList', {sceneName: currentSceneName});
        return (await newAction.filterAsync(currSceneSources.sceneItems, async (sourceObj) => {
            if (sourceObj.isGroup) {
                let groupSources = await obs.call('GetGroupSceneItemList', {sceneName: sourceObj.sourceName});
                return groupSources.sceneItems.filter(source =>
                    targetSources.includes(source.sourceName)
                ).length != 0;
            } else {
                return targetSources.includes(sourceObj.sourceName);
            }
        })).length != 0;
    }

    /* Returns an array of the visible sources specified in targetSources */
    async findVisibleSources(targetSources) {
        let visibleSources = [];
        for (let source of targetSources) {
            let isVisible = (await obs.call('GetSourceActive',
                {sourceName: source}
            )).videoActive;
            if (isVisible) visibleSources.push(source);
        }
        return visibleSources;
    }

    /* Returns an action's command list with replaced keywords */
    async getCommandList(source) {
        let foundKeywords = keywordController.detectKeywords(this.commands);
        let dictionnary = await keywordController.getKeywordsValue(foundKeywords, {sourceName: source});

        let commands = [];
        for (let com of this.commands) {
            let properties = keywordController.replaceKeywords(com.properties, dictionnary);
            commands.push(commandFactory.buildCommandFromName(com.name, properties));
        }
        return commands;
    }
}