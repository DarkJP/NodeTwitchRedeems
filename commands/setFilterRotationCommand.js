const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;

module.exports = class setFilterRotationCommand extends command {
    async execute() {
        await obs.call('SetSourceFilterSettings',
            {sourceName: this.sourceName,
             filterName: this.filterName,
             filterSettings: {rotation: this.rotation}
            }
        );
    }

    constructor(sourceName, filterName, rotation) {
        super();
        this.sourceName = sourceName;
        this.filterName = filterName;
        this.rotation = rotation;
    }

    static loadFromData(properties) {
        let sourceName = properties.sourceName ?? '';
        let filterName = properties.filterName ?? '';
        let rotation = properties.rotation ?? 0;
        return new setFilterRotationCommand(sourceName, filterName, rotation);
    }
}