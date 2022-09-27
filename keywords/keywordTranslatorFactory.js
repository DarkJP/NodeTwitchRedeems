const envTranslator = require('./envTranslator.js');
const obsTranslator = require('./obsTranslator.js');
const varTranslator = require('./varTranslator.js');

module.exports = class keywordTranslatorFactory {

    static getTranslator(category, properties) {
        switch (category) {
            case 'env':
                return new envTranslator();
            case 'obs':
                return new obsTranslator(properties.sourceName);
            case 'var':
                return new varTranslator();

            default:
                console.error(`No translator found for category ${category}`);
        }
    }
}