const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;

module.exports = class deleteFilterCommand extends command {
    async execute() {
        await obs.call('RemoveSourceFilter',
            {sourceName: this.sourceName,
             filterName: this.filterName}
        );
    }

    constructor(sourceName, filterName) {
        super();
        this.sourceName = sourceName;
        this.filterName = filterName;
    }

    static loadFromData(properties) {
        let sourceName = properties.sourceName ?? '';
        let filterName = properties.filterName ?? '';
        return new deleteFilterCommand(sourceName, filterName);
    }
}