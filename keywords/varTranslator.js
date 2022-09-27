const keywordTranslator = require('./keywordTranslator.js');

module.exports = class varTranslator extends keywordTranslator {

    constructor() {
        super('var');
    }

    async translate(str) {
        switch (str) {
            case '$varRandom':
                return Math.random();
            default:
                console.error(`varTranslator: cannot translate keyword ${str}`);
        }
    }
}