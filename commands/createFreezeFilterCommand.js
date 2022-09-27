const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;

module.exports = class createFreezeFilterCommand extends command {
    async execute() {
        await obs.call('CreateSourceFilter',
            {sourceName: this.sourceName,
             filterName: this.filterName,
             filterKind: 'freeze_filter'}
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
        return new createFreezeFilterCommand(sourceName, filterName);
    }
}