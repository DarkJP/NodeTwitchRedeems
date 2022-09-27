const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;
const { groupSearch } = require('./groupSearch.js');

module.exports = class setSourcePositionCommand extends command {
    async execute() {

        try {
            let foundItem = await groupSearch(this.sceneName, this.sourceName);
            if (foundItem) {
                await obs.call('SetSceneItemTransform',
                    {sceneName: foundItem.groupName ?? this.sceneName,
                     sceneItemId: foundItem.itemId,
                     sceneItemTransform: {
                        positionX: parseInt(this.position.x),
                        positionY: parseInt(this.position.y)}
                    }
                );
            } else {
                throw new Error();
            }
        } catch (err) {
            console.log('setSourcePosition CPT');
            console.log(`Couldn't change position`);
            console.log(err);
        }
    }

    constructor(sceneName, sourceName, position) {
        super();
        this.sceneName = sceneName;
        this.sourceName = sourceName;
        this.position = position;
    }

    static loadFromData(properties) {
        let sceneName = properties.sceneName ?? '';
        let sourceName = properties.sourceName ?? '';
        let position = properties.position ?? 0;
        return new setSourcePositionCommand(sceneName, sourceName, position);
    }
}