const keywordTranslator = require('./keywordTranslator.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;

module.exports = class obsTranslator extends keywordTranslator {

    constructor(sourceName) {
        super('obs');
        this.sourceName = sourceName;
    }

    async translate(str) {
        switch (str) {
            case '$obsSceneName':
                return await this.getSceneName();
            case '$obsXScale':
                return (await this.checkSourceSettings('scaleX'));
            case '$obsYScale':
                return (await this.checkSourceSettings('scaleY'));
            case '$obsXPosition':
                return (await this.checkSourceSettings('positionX'));
            case '$obsYPosition':
                return (await this.checkSourceSettings('positionY'));
            case '$obsWidth':
                return (await this.checkSourceSettings('width'));
            case '$obsHeight':
                return (await this.checkSourceSettings('height'));
            case '$obsCanvasHeight':
                return (await this.getCanvasSize('height'));
            case '$obsCanvasWidth':
                return (await this.getCanvasSize('width'));
            default:
                console.error(`obsTranslator: cannot translate keyword ${str}`);
        }
    }

    async checkSourceSettings(settingToCheck) {
        let sceneName = await this.getSceneName();
        let sourceId = (await obs.call('GetSceneItemId',
         {sceneName: sceneName,
          sourceName: this.sourceName}
        )).sceneItemId;

        let info = (await obs.call('GetSceneItemTransform',
            {sceneName: sceneName, sceneItemId: sourceId}
        )).sceneItemTransform;

        return info[settingToCheck] ?? undefined;
    }

    async getSceneName() {
        return (await obs.call('GetCurrentProgramScene')).currentProgramSceneName;
    }

    async getCanvasSize(which) {
        let info = await obs.call('GetVideoSettings');
        return which == 'width' ? info.baseWidth : info.baseHeight;
    }
}