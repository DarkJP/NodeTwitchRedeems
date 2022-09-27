const keywords = require('./keywordList.js');
const translatorFactory = require('./keywordTranslatorFactory.js');

module.exports = class keywordController {

    static detectKeywords(obj) {
        switch (typeof obj) {
            case 'object':
                let arr = [];
                if (Array.isArray(obj)) {
                    arr = obj;
                } else {
                    arr = Object.values(obj);
                }
                return keywordController.detectKeywordsLoop(arr);

            case 'string':
                return keywordController.detectKeywordsString(obj);

            default:
                return [];
        }
    }

    static detectKeywordsString(str) {
        let foundKeywords = [];
        for (let k of keywords) {
            if (str.includes(k.name) && !foundKeywords.includes(k.name)) {
                foundKeywords.push(k.name);
            }
        }
        return foundKeywords;
    }

    static detectKeywordsLoop(arr) {
        let finalKeywords = [];
        for (let el of arr) {
            finalKeywords.push(...keywordController.detectKeywords(el));
        }
        return keywordController.removeDuplicates(finalKeywords);
    }

    static removeDuplicates(arr) {
        return arr.filter((item, 
            index) => arr.indexOf(item) === index);
    }


    static async getKeywordsValue(foundKeywords, translatorProperties = {}) {
        let dictionnary = {};
        for (let kw of foundKeywords) {
            let category = keywords.find(k => k.name == kw).category;
            let translator = translatorFactory.getTranslator(category, translatorProperties);
            let value = await translator.translate(kw);
            dictionnary[kw] = value;
        }
        return dictionnary;
    }


    static replaceKeywords(obj, dictionnary) {
        let clone = JSON.parse(JSON.stringify(obj));

        switch (typeof clone) {
            case 'object':
                for (let key in clone) {
                    clone[key] = keywordController.replaceKeywords(clone[key], dictionnary);
                }
                return clone;

            case 'string':
                let init = JSON.parse(JSON.stringify(clone));
                for (let keyword in dictionnary) {
                    clone = clone.replaceAll(keyword, dictionnary[keyword]);
                }
                if (init != clone) {
                    clone = eval(clone);
                }
                return clone;

            default:
                return clone;    
        }

        return clone;
    }
}