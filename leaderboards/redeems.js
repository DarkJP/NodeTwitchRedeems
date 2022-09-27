const { readFileSync, writeFileSync } = require('fs');

let board;
const filename = './data/redeemsLeaderboard.json';

exports.init = () => {
    try {
        let rawBoardData = readFileSync(filename, 'utf-8');
        board = JSON.parse(rawBoardData);

        if (board.dataSince == null) {
            let today = new Date().toLocaleDateString('fr-FR');
            board.dataSince = today;
            console.log('Redeems leaderboard date set to ' + today);
        }

        startAutoSave();

    } catch(err) {
        console.log('redeems.js PT');
        console.log(err);
    }
}

function startAutoSave() {
    setInterval(save, 1 * 60000);
}

exports.close = () => {
    save();
}

function save() {
    try {
        writeFileSync(filename, JSON.stringify(board), 'utf8');
        // console.log('Redeems leaderboard file saved');
    } catch(err) {
        console.log('Could not save redeems leaderboard file:');
        console.log(err);
    }
}

exports.getBoard = () => {
    return board;
}

exports.updateScore = (userName, displayName, redeemName, cost) => {
    board.totalcost += cost;

    let userIndex = board.redeems.findIndex(user => user.userName == userName);
    /* User is not in the leaderboard yet */
    if (userIndex == -1) {
        let newUser = getNewUser(userName, displayName);
        newUser.score[redeemName] = 1;
        board.redeems.push(newUser);

    } else { // User is already in the leaderboard
        board.redeems[userIndex].score[redeemName] =
            ++board.redeems[userIndex].score[redeemName] || 1;
    }
}

function getNewUser(userName, displayName) {
    return {
        userName: userName,
        displayName: displayName,
        score: {}
    };
}