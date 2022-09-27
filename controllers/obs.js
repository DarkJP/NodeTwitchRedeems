require('dotenv').config();
const OBSWebSocket = require('obs-websocket-js').default;
const obs = new OBSWebSocket();
exports.ws = obs;

exports.connect = async function() {
    try {
        await obs.connect('ws://' + process.env.OBS_ADDRESS, process.env.OBS_PWD);
        console.log('\nOBS Connection successful\n');

    } catch (err) {
        console.log('/!\\ OBS connection failed\n'
                    + ' - Make sure OBS is running before starting this server\n'
                    + ' - Make sure the .env credentials are correct\n');
    }
}