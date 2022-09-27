const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;
const { groupSearch } = require('./groupSearch.js');

module.exports = class deleteSourceCommand extends command {
    async execute() {

        try {
            await obs.call('RemoveInput', {inputName: this.sourceName});

        } catch(err) {
            console.log(err);
            console.log(`Could not delete source '${this.sourceName}' in scene '${this.sceneName}'.`);
        }
    }

    constructor(sceneName, sourceName) {
        super();
        this.sceneName = sceneName;
        this.sourceName = sourceName;
    }

    static loadFromData(properties) {
        let sceneName = properties.sceneName ?? '';
        let sourceName = properties.sourceName ?? '';
        return new deleteSourceCommand(sceneName, sourceName);
    }
}