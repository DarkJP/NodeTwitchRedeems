const { existsSync, writeFileSync, mkdirSync } = require('fs');

exports.check = () => {
    if (!existsSync('./data/')) {
        mkdirSync('./data');
    }

    if (!existsSync('./data/settings.json')) {
        writeFileSync('./data/settings.json', JSON.stringify({"isAuth":false}));
    }

    if (!existsSync('./.env')) {
        let data =
            '# Ports on which the servers runs\n'
            + 'DASHBOARD_PORT="3001"\n'
            + 'REDEEMS_LEADERBOARD_PORT="3003"\n\n'
            + '# Your Twitch channel ID\n'
            + 'CHANNEL_ID=""\n'
            + 'CHANNEL_NAME=""\n'
            + 'REDIRECT_URL=""\n\n'
            + '# Application client & secret ID\n'
            + 'CLIENT_ID=""\n'
            + 'CLIENT_SECRET=""\n\n'
            + '# OBS websockets plugin settings\n'
            + 'OBS_ADDRESS=""\n'
            + 'OBS_PWD=""\n\n'
            + '# Used for automatic posting in the desired Discord channel\n'
            + '# Leave empty if you don\'t want that\n'
            + 'DISCORD_WEBHOOK_URL=""';

        writeFileSync('./.env', data);
        throw new Error('.env configuration file has just been created.\n'
                        + 'Please edit it according to your needs and restart the server.');
    }

    if (!existsSync('./data/token.txt')) {
        writeFileSync('./data/token.txt', '');
    }

    if (!existsSync('./data/refreshToken.txt')) {
        writeFileSync('./data/refreshToken.txt', '');
    }

    if (!existsSync('./actions/actions.json')) {
        writeFileSync('./actions/actions.json', JSON.stringify([]));
    }

    if (!existsSync('./data/redeemsLeaderboard.json')) {
        let data = {dataSince: null, totalcost: 0, redeems:[]};
        writeFileSync('./data/redeemsLeaderboard.json', JSON.stringify(data));
    }

    if (!existsSync('./OBSSources/')) {
        mkdirSync('./OBSSources');
    }

    if (!existsSync('./scans/')) {
        mkdirSync('./scans');
    }
}