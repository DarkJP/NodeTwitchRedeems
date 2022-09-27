const { readFileSync } = require('fs');
const actionController = require('../actions/actionController.js');
const actionsFile = './actions/actions.json';

exports.actions = actionController.createActionsFromFile(actionsFile);

exports.reloadActions = () => {
    this.actions = actionController.createActionsFromFile(actionsFile);
}