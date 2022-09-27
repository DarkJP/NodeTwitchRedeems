const createAudioSource = require('./createAudioSourceCommand.js');
const createColorFilter = require('./createColorFilterCommand.js');
const createFreezeFilter = require('./createFreezeFilterCommand.js');
const createScrollFilter = require('./createScrollFilterCommand.js');
const createSharpenFilter = require('./createSharpenFilterCommand.js');
const deleteFilter = require('./deleteFilterCommand.js');
const deleteSource = require('./deleteSourceCommand.js');
const displayFilter = require('./displayFilterCommand.js');
const displaySource = require('./displaySourceCommand.js');
const displaySourceEvery = require('./displaySourceEveryCommand.js');
const saveScreenshot = require('./saveScreenshotCommand.js');
const setFilterDelay = require('./setFilterDelayCommand.js');
const setFilterRotation = require('./setFilterRotationCommand.js');
const setSourcePosition = require('./setSourcePositionCommand.js');
const setSourceScale = require('./setSourceScaleCommand.js');
const wait = require('./waitCommand.js');

module.exports = class commandFactory {
    static buildCommandFromName(name, properties) {
        switch(name) {
            case 'createAudioSource':
                return createAudioSource.loadFromData(properties);
                break;

            case 'createColorFilter':
                return createColorFilter.loadFromData(properties);
                break;

            case 'createFreezeFilter':
                return createFreezeFilter.loadFromData(properties);
                break;

            case 'createScrollFilter':
                return createScrollFilter.loadFromData(properties);
                break;

            case 'createSharpenFilter':
                return createSharpenFilter.loadFromData(properties);
                break;

            case 'deleteFilter':
                return deleteFilter.loadFromData(properties);
                break;

            case 'deleteSource':
                return deleteSource.loadFromData(properties);
                break;

            case 'displayFilter':
                return displayFilter.loadFromData(properties);
                break;

            case 'displaySource':
                return displaySource.loadFromData(properties);
                break;

            case 'displaySourceEvery':
                return displaySourceEvery.loadFromData(properties);
                break;

            case 'saveScreenshot':
                return saveScreenshot.loadFromData(properties);
                break;

            case 'setFilterDelay':
                return setFilterDelay.loadFromData(properties);
                break;

            case 'setFilterRotation':
                return setFilterRotation.loadFromData(properties);
                break;

            case 'setSourcePosition':
                return setSourcePosition.loadFromData(properties);
                break;

            case 'setSourceScale':
                return setSourceScale.loadFromData(properties);
                break;

            case 'wait':
                return wait.loadFromData(properties);
                break;

            default:
                console.error(`No command with name ${name}`);
        }
    }
}