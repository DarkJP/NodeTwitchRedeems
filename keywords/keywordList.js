const keyword = require('./keyword.js');

module.exports = [
    new keyword('$envSource', 'env'),
    new keyword('$envScreenshotPath', 'env'),
    new keyword('$obsSceneName', 'obs'),
    new keyword('$obsXScale', 'obs'),
    new keyword('$obsYScale', 'obs'),
    new keyword('$obsXPosition', 'obs'),
    new keyword('$obsYPosition', 'obs'),
    new keyword('$obsWidth', 'obs'),
    new keyword('$obsHeight', 'obs'),
    new keyword('$obsCanvasWidth', 'obs'),
    new keyword('$obsCanvasHeight', 'obs'),
    new keyword('$varRandom', 'var')
];