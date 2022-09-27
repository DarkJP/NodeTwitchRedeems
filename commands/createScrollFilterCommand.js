const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;

module.exports = class createScrollFilterCommand extends command {
    async execute() {
        await obs.call('CreateSourceFilter',
            {sourceName: this.sourceName,
             filterName: this.filterName,
             filterKind: 'scroll_filter',
             filterSettings: {speed_x: this.speedX}
            }
        );
    }

    constructor(sourceName, filterName, speedX) {
        super();
        this.sourceName = sourceName;
        this.filterName = filterName;
        this.speedX = speedX;
    }

    static loadFromData(properties) {
        let sourceName = properties.sourceName ?? '';
        let filterName = properties.filterName ?? '';
        let speedX = properties.speedX ?? 0;
        return new createScrollFilterCommand(sourceName, filterName, speedX);
    }
}