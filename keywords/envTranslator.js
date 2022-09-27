const keywordTranslator = require('./keywordTranslator.js');

module.exports = class envTranslator extends keywordTranslator {

    constructor() {
        super('env');
    }

    async translate(str) {
        switch (str) {
            case '$envSource':
                return process.env.OBS_SOURCE_NAME;
            case '$envScreenshotPath':
                return process.env.SCREENSHOTS_PATH;
            default:
                console.error(`envTranslator: cannot translate keyword ${str}`);
        }
    }
}