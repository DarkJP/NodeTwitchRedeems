const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;
const { groupSearch } = require('./groupSearch.js');

module.exports = class displaySourceCommand extends command {
    async execute() {
        try {

            let foundItem = await groupSearch(this.sceneName, this.sourceName);
            if (foundItem) {
                await obs.call('SetSceneItemEnabled',
                 {sceneName: foundItem.groupName ?? this.sceneName,
                  sceneItemId: foundItem.itemId,
                  sceneItemEnabled: this.isVisible}
                );

            } else {
                throw new Error();
            }

        } catch(err) {
            let state = this.isVisible ? 'display' : 'hide';
            console.log(`Could not ${state} source '${this.sourceName}' in scene '${this.sceneName}', it doesn't exist.`);
        }
    }

    constructor(sceneName, sourceName, isVisible) {
        super();
        this.sceneName = sceneName;
        this.sourceName = sourceName;
        this.isVisible = isVisible;
    }

    static loadFromData(properties) {
        let sceneName = properties.sceneName ?? '';
        let sourceName = properties.sourceName ?? '';
        let isVisible = properties.isVisible ?? false;
        return new displaySourceCommand(sceneName, sourceName, isVisible);
    }
}