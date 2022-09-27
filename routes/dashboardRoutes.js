const path = require('path');
const fetch = require('node-fetch');
const express = require('express');
const { readFileSync, writeFileSync } = require('fs');
const controller = require('../controllers/controller.js');
const router = express.Router();

router.get('/', (req, res, next) => {
    res.sendFile(path.join(__dirname, './../publicDashboard', 'index.html'));
});

router.get('/getactions', async (req, res) => {
    let actions = readFileSync('actions/actions.json', {encoding: 'utf-8'});
    res.status(200).json({ actions: actions });
});

router.get('/getports', express.json(), async (req, res) => {
    let p1 = process.env.DASHBOARD_PORT ?? 3000;
    let p2 = process.env.REDEEMS_LEADERBOARD_PORT ?? 3001;

    res.status(200).json({ ports: {'p1': p1, 'p2': p2} });
});

router.post('/action', express.json(), async (req, res) => {
    let action = await controller.actions.execute(req.body.actionName);
    res.status(200).json({ action });
});

router.post('/saveactions', express.json(), async (req, res) => {
    writeFileSync('./actions/actions.json', JSON.stringify(req.body.actions), 'utf8');
    controller.reloadActions();
    res.status(200).json({ msg: 'Actions saved.' });
});

router.get('/getclientid', express.json(), async (req, res) => {
    let clientId = process.env.CLIENT_ID ?? undefined;

    res.status(200).json({ clientId });
});

router.post('/creds', express.json(), async (req, res) => {

    let TokenReqStr =
        'https://id.twitch.tv/oauth2/token?client_id='
        + process.env.CLIENT_ID
        + '&client_secret='
        + process.env.CLIENT_SECRET
        + '&code='
        + req.body.code
        + '&grant_type=authorization_code&redirect_uri=' + process.env.REDIRECT_URL;
    let tokenRes = await fetch(TokenReqStr, {method: 'POST'});
    let tokenAns = await tokenRes.json();

    writeFileSync('./data/refreshToken.txt', tokenAns.refresh_token);
    writeFileSync('./data/token.txt', tokenAns.access_token);

    setSetting('isAuth', true);

    res.status(200).json({ msg: 'App authorized successfuly.' });
    console.log('\nAuth info saved.\nYou can restart the server.');
    process.exit(0);
});

function setSetting(setting, val) {
    let rawSettings = readFileSync('./data/settings.json', {encoding: 'utf-8'});
    let settings = JSON.parse(rawSettings);
    settings[setting] = val;
    writeFileSync('./data/settings.json', JSON.stringify(settings), 'utf8');
}

module.exports = router;