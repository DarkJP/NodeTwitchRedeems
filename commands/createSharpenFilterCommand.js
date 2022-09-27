const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;

module.exports = class createSharpenFilterCommand extends command {
    async execute() {
        await obs.call('CreateSourceFilter',
            {sourceName: this.sourceName,
             filterName: this.filterName,
             filterKind: 'sharpness_filter_v2',
             filterSettings: { sharpness: this.sharpness }
            }
        );
    }

    constructor(sourceName, filterName, sharpness) {
        super();
        this.sourceName = sourceName;
        this.filterName = filterName;
        this.sharpness = sharpness;
    }

    static loadFromData(properties) {
        let sourceName = properties.sourceName ?? '';
        let filterName = properties.filterName ?? '';
        let sharpness = properties.sharpness ?? 0;
        return new createSharpenFilterCommand(sourceName, filterName, sharpness);
    }
}