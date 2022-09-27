const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;

module.exports = class setFilterDelayCommand extends command {
    async execute() {
        await obs.call('SetSourceFilterSettings',
            {sourceName: this.sourceName,
             filterName: this.filterName,
             filterSettings: {delay_ms: this.delay}
            }
        );
    }

    constructor(sourceName, filterName, delay) {
        super();
        this.sourceName = sourceName;
        this.filterName = filterName;
        this.delay = delay;
    }

    static loadFromData(properties) {
        let sourceName = properties.sourceName ?? '';
        let filterName = properties.filterName ?? '';
        let delay = properties.delay ?? 0;
        return new setFilterDelayCommand(sourceName, filterName, delay);
    }
}