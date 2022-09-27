const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;

module.exports = class createColorFilterCommand extends command {
    async execute() {
        await obs.call('CreateSourceFilter',
            {sourceName: this.sourceName,
             filterName: this.filterName,
             filterKind: 'color_filter_v2',
             filterSettings: this.colorSettings}
        );
    }

    constructor(sourceName, filterName, colorSettings) {
        super();
        this.sourceName = sourceName;
        this.filterName = filterName;
        this.colorSettings = colorSettings;
    }

    static loadFromData(properties) {
        let sourceName = properties.sourceName ?? '';
        let filterName = properties.filterName ?? '';
        let colorSettings = properties.colorSettings ?? {};
        return new createColorFilterCommand(sourceName, filterName, colorSettings);
    }
}