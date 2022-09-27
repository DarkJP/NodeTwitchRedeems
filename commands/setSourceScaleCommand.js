const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;
const { groupSearch } = require('./groupSearch.js');

module.exports = class setSourceScaleCommand extends command {
    async execute() {

        try {
            let foundItem = await groupSearch(this.sceneName, this.sourceName);
            if (foundItem) {
                await obs.call('SetSceneItemTransform',
                    {sceneName: foundItem.groupName ?? this.sceneName,
                     sceneItemId: foundItem.itemId,
                     sceneItemTransform: {
                        scaleX: parseFloat(this.scale.x),
                        scaleY: parseFloat(this.scale.y)}
                    }
                );

            } else {
                throw new Error();
            }
        } catch(err) {
            console.log(`Could not transform source '${this.sourceName}' in scene '${this.sceneName}'.`);
            console.log(err);
        }
    }

    constructor(sceneName, sourceName, scale) {
        super();
        this.sceneName = sceneName;
        this.sourceName = sourceName;
        this.scale = scale;
    }

    static loadFromData(properties) {
        let sceneName = properties.sceneName ?? '';
        let sourceName = properties.sourceName ?? '';
        let scale = properties.scale ?? 1;
        return new setSourceScaleCommand(sceneName, sourceName, scale);
    }
}