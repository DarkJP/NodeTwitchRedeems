const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;
const { groupSearch } = require('./groupSearch.js');

module.exports = class displaySourceEveryCommand extends command {
    async execute() {

        let foundItem = await groupSearch(this.sceneName, this.sourceName);

        await obs.call('SetSceneItemEnabled',
         {sceneName: foundItem.groupName ?? this.sceneName,
          sceneItemId: foundItem.itemId,
          sceneItemEnabled: true}
        );
        await new Promise(resolve => setTimeout(resolve, this.duration));
        await obs.call('SetSceneItemEnabled',
         {sceneName: foundItem.groupName ?? this.sceneName,
          sceneItemId: foundItem.itemId,
          sceneItemEnabled: false}
        );
    }

    constructor(sceneName, sourceName, duration, interval) {
        super();
        this.sceneName = sceneName;
        this.sourceName = sourceName;
        this.duration = duration;
        this.interval = interval;
    }

    static loadFromData(properties) {
        let sceneName = properties.sceneName ?? '';
        let sourceName = properties.sourceName ?? '';
        let duration = properties.duration ?? '';
        let interval = properties.interval ?? 0;
        return new displaySourceEveryCommand(sceneName, sourceName, duration, interval);
    }
}