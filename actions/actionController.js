const fs = require('fs');
const action = require('./action.js');

module.exports = class actionController {

    constructor(actions) {
        this.runningActions = [];
        this.actions = actions;
        this.timedActions = [];
    }

    static createActionsFromFile(filename) {
        let rawData = fs.readFileSync(filename, 'utf-8');
        let actionsData = JSON.parse(rawData);
        let actions = actionsData.map(act => action.loadFromData(act));
        return new actionController(actions);
    }

    getActionFromName(actionName) {
        return this.actions.find(action => action.name == actionName);
    }

    async execute(actionName) {
        try {
            let action = this.getActionFromName(actionName);

            if (action != undefined) {
                let index = this.runningActions.indexOf(actionName);
                let incompatibility = this.runningActions.some(a => action.incompatibilities.includes(a));
                /* TODO autoriser les actions qui peuvent être déclenchées en parallèle */
                if (index == -1 && !incompatibility) {
                    this.runningActions.push(actionName);
                    let res = await action.execute();

                    index = this.runningActions.indexOf(actionName);
                    this.runningActions.splice(index, 1);

                    return res;

                } else {
                    return incompatibility
                        ? { msg: `Cannot trigger '${actionName}' - another incompatible action is playing.` }
                        : { msg: `Action '${actionName}' already playing.` };
                }

            } else {
                console.log(`actionController: Unknown action: '${actionName}'`);
            }
        } catch (err) {
            console.log(err);
        }
    }
}