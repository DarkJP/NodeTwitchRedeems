const checkFiles = require('./controllers/checkFiles.js');
try {
    checkFiles.check();
} catch (err) {
    console.error(err.message);
    process.exit(1);
}

require('dotenv').config();
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const { readFileSync } = require('fs');
const obs = require('./controllers/obs.js');
const controller = require('./controllers/controller.js');
const redeemsBoard = require('./leaderboards/redeems.js');

/* +----------------------------+ */
/* |      Dashboard Server      | */
/* +----------------------------+ */
const dashboard = express();
const dashboardServer = http.createServer(dashboard);
const dashboardRoutes = require('./routes/dashboardRoutes');
dashboard.use('/', dashboardRoutes);
dashboard.use(express.static('publicDashboard'));

/* +----------------------------+ */
/* | Redeems Leaderboard Server | */
/* +----------------------------+ */
const redeemsLeaderboard = express();
const redeemsLeaderboardServer = http.createServer(redeemsLeaderboard);
const redeemsLeaderboardRoutes = require('./routes/redeemsLeaderboardRoutes');
redeemsLeaderboard.use('/', redeemsLeaderboardRoutes);
redeemsLeaderboard.use(express.static('publicRedeemsLeaderboard'));
const redeemsio = socketio(redeemsLeaderboardServer);
exports.redeemsio = redeemsio;

/* +----------------------------+ */
/* |      Twitch Connection     | */
/* +----------------------------+ */
const twitchPubSub = require('./controllers/twitchRedeems.js');

/* +----------------------------+ */
/* |        Entry Point         | */
/* +----------------------------+ */
(async () => {
    try {
        const DASHBOARD_PORT = process.env.DASHBOARD_PORT ?? 3000;
        dashboardServer.listen(DASHBOARD_PORT);

        const REDEEMS_LEADERBOARD_PORT = process.env.REDEEMS_LEADERBOARD_PORT ?? 3002;
        redeemsLeaderboardServer.listen(REDEEMS_LEADERBOARD_PORT);

        console.log(DASHBOARD_PORT.toString().length == 3
            ? '+----------------------------------------------------------+\n'
                + '|                         Welcome!                         |\n'
                + '|   Dashboard can be accessed from: http://localhost:' + DASHBOARD_PORT + '   |\n'
                + '+----------------------------------------------------------+'
            : '+-----------------------------------------------------------+\n'
                + '|                         Welcome!                          |\n'
                + '|   Dashboard can be accessed from: http://localhost:' + DASHBOARD_PORT + '   |\n'
                + '+-----------------------------------------------------------+'
        );
        console.log('Press ctrl + C anytime to stop the server.\n'
                    + 'Start the server with \'node server.js\'');

        let rawSettings = readFileSync('./data/settings.json', 'utf8');
        let settings = JSON.parse(rawSettings);
        if (!settings.isAuth) {
            console.log(
                'Application not authorized yet.'
                + '\nHead over to the \'Settings\' menu in the dashboard.'
            );

        } else {

            await obs.connect();
            twitchPubSub.startAuth();

            /* +---------------------------------+ */
            /* | Start timeouts for auto actions | */
            /* +---------------------------------+ */
            let actionsObj = controller.actions;
            for (let action of actionsObj.actions) {
                let autoAction = action.commands.find(com => com.name == 'displaySourceEvery');
                if (autoAction != undefined) {
                    setInterval(() => {
                        actionsObj.execute(action.name);
                    }, autoAction.properties.interval);
                }
            }

            /* +---------------------------------+ */
            /* |        Load Leaderboards        | */
            /* +---------------------------------+ */
            redeemsBoard.init();

            /* +----------------------------------------+ */
            /* |  Redeems Leaderboard Socket Connection | */
            /* +----------------------------------------+ */
            redeemsio.on('connection', socket => {
                socket.emit('boardData', JSON.stringify(redeemsBoard.getBoard()));
            });
        }

    } catch(err) {
        console.log('Could not start the server.');
        console.log(err);
    }
})();

/* Properly save the leaderboard file on close */
process.on('SIGINT', cleanUp);
process.on('SIGHUP', cleanUp);
process.on('SIGBREAK', cleanUp);

function cleanUp() {
    redeemsBoard.close();
    process.exit(0);
}

exports.absolutePath = __dirname.replace(/\\/g, '/');