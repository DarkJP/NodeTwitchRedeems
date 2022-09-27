const fetch = require('node-fetch');
const command = require('./command.js');
const obsController = require('../controllers/obs.js');
const obs = obsController.ws;

/* Discord webhook */
const { Webhook, MessageBuilder } = require('discord-webhook-node');

module.exports = class saveScreenshotCommand extends command {
    async execute() {
        try {
            let dateToday = new Date();
            let fileName = dateToday.toLocaleDateString('fr-FR').replace(/\//g, '-')
                           + '_'
                           + dateToday.toLocaleTimeString('fr-FR').replace(/:/g, '-')
                           + '.png';

            await obs.call('SaveSourceScreenshot',
             {sourceName: this.sourceName,
              imageFormat: 'png',
              imageFilePath: this.path + fileName}
            );

            /* Post to Discord */
            if (process.env.DISCORD_WEBHOOK_URL != '') {
                const hook = new Webhook(process.env.DISCORD_WEBHOOK_URL);
                hook.sendFile(this.path + fileName);
            }

        } catch (err) {
            console.log('Could not save screenshot, source was hidden or empty.');
        }
    }

    constructor(sourceName, path) {
        super();
        this.sourceName = sourceName;
        this.path = path;
    }

    static loadFromData(properties) {
        let sourceName = properties.sourceName ?? '';
        let path = properties.path ?? '';
        return new saveScreenshotCommand(sourceName, path);
    }
}