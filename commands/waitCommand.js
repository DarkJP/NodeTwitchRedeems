const command = require('./command.js');

module.exports = class waitCommand extends command {
    async execute() {
        return new Promise(resolve => setTimeout(resolve, this.ms));
    }

    constructor(ms) {
        super();
        this.ms = ms;
    }

    static loadFromData(properties) {
        let delay = properties.delay ?? 0;
        return new waitCommand(delay);
    }
}