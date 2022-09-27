const { existsSync } = require('fs');
const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;

module.exports = class createAudioSourceCommand extends command {
    async execute() {
        try {
            if (existsSync(this.filePath)) {

                await obs.call('CreateInput',
                 {sceneName: this.sceneName,
                  inputName: this.sourceName,
                  inputKind: 'ffmpeg_source'}
                );

                await obs.call('SetInputAudioMonitorType',
                 {inputName: this.sourceName,
                  monitorType: 'OBS_MONITORING_TYPE_MONITOR_AND_OUTPUT'}
                );

                await obs.call('SetInputSettings',
                 {inputName: this.sourceName,
                  inputSettings: {local_file: this.filePath}
                 }
                );
            } else {
                console.log(`Could not create source '${this.sourceName}' in scene '${this.sceneName}' because the file '${this.filePath}' does not exist.`);
            }
        } catch (err) {
            console.log(`There is already a source with name '${this.sourceName}'`);
        }
    }

    constructor(sourceName, sceneName, filePath) {
        super();
        this.sourceName = sourceName;
        this.sceneName = sceneName;
        this.filePath = filePath;
    }

    static loadFromData(properties) {
        let sourceName = properties.sourceName ?? '';
        let sceneName = properties.sceneName ?? '';
        let filePath = properties.filePath ?? '';
        return new createAudioSourceCommand(sourceName, sceneName, filePath);
    }
}