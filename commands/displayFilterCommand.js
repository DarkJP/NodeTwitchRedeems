const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;

module.exports = class displayFilterCommand extends command {
    async execute() {
        await obs.call('SetSourceFilterEnabled',
            {
                sourceName: this.sourceName,
                filterName: this.filterName,
                filterEnabled: this.isEnabled
            }
        );
    }

    constructor(sourceName, filterName, isEnabled) {
        super();
        this.sourceName = sourceName;
        this.filterName = filterName;
        this.isEnabled = isEnabled;
    }

    static loadFromData(properties) {
        let sourceName = properties.sourceName ?? '';
        let filterName = properties.filterName ?? '';
        let isEnabled = properties.isEnabled ?? false;
        return new displayFilterCommand(sourceName, filterName, isEnabled);
    }
}