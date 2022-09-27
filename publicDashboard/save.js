function saveToJson(opt_actions) {
    let actionArray = [];

    for (let action of opt_actions.children) {

        let actionObj = {};
        let table = action.lastChild.lastChild;

        getPrimaryInfo(actionObj, table);
        getCommands(actionObj, table.lastChild);

        actionArray.push(actionObj);
    }

    sendToServer(actionArray);
}

function getPrimaryInfo(actionObj, table) {
    let ftr = table.firstChild;
    actionObj['name'] = ftr.firstChild.firstChild.value;
    actionObj['desc'] = ftr.lastChild.firstChild.value;

    let str = ftr.nextSibling;

    let ftd = str.firstChild;
    actionObj['targetSources'] = strToArr(ftd.firstChild.value);

    let std = ftd.nextSibling;
    actionObj['needsVisibleSources'] =
        std.lastChild.value.toLowerCase() == 'yes';

    let tdt = std.nextSibling;
    if (tdt.firstChild.value != '') {
        actionObj['incompatibilities'] = strToArr(tdt.firstChild.value);
    }
}

function getCommands(actionObj, commandsContainer) {
    actionObj['commands'] = [];
    let commandObj;

    let commandTr = commandsContainer.firstChild.lastChild.children;

    for (let command of commandTr) {
        commandObj = nameToCommand(command.firstChild.firstChild.value);

        let propertiesTd = command.firstChild.nextSibling;
        let foundProps = [];
        for (let property of propertiesTd.children) {
            if (property?.type == 'text') {
                foundProps.push(property.value);
            } else if (property?.type == 'select-one') {
                foundProps.push(property.value.toLowerCase() == 'yes');
            }
        }

        let i = 0;
        for (let [key, value] of Object.entries(commandObj.properties)) {

            if (commandObj.name == 'setSourcePosition'
                || commandObj.name == 'setSourceScale') {

                if (i == 2) {
                    if (foundProps[i] != '') { // -> Scale X input
                        commandObj.properties[key].x = foundProps[i];
                    }
                    if (foundProps[i+1] != '') { // -> Scale Y input
                        commandObj.properties[key].y = foundProps[i+1];
                    }
                } else {
                    commandObj.properties[key] = foundProps[i];
                }

            } else if (commandObj.name == 'createSharpenFilter') {
                let x = parseFloat(foundProps[i]);
                commandObj.properties[key] = !Number.isNaN(x) ? x : foundProps[i];

            } else if (commandObj.name == 'createColorFilter') {
                if (i == 2) {
                    if (foundProps[i] != '') { // -> contrast input
                        let x = parseFloat(foundProps[i]);
                        commandObj.properties[key].contrast =
                            !Number.isNaN(x) ? x : foundProps[i];
                    }
                    if (foundProps[i+1] != '') { // -> gamma input
                        let x = parseFloat(foundProps[i+1]);
                        commandObj.properties[key].gamma =
                            !Number.isNaN(x) ? x : foundProps[i+1];
                    }
                    if (foundProps[i+2] != '') { // -> hue_shift input
                        let x = parseFloat(foundProps[i+2]);
                        commandObj.properties[key].hue_shift =
                            !Number.isNaN(x) ? x : foundProps[i+2];
                    }
                    if (foundProps[i+3] != '') { // -> opacity input
                        let x = parseFloat(foundProps[i+3]);
                        commandObj.properties[key].opacity =
                            !Number.isNaN(x) ? x : foundProps[i+3];
                    }
                    if (foundProps[i+4] != '') { // -> saturation input
                        let x = parseFloat(foundProps[i+4]);
                        commandObj.properties[key].saturation =
                            !Number.isNaN(x) ? x : foundProps[i+4];
                    }
                    if (foundProps[i+5] != '') { // -> brightness input
                        let x = parseFloat(foundProps[i+5]);
                        commandObj.properties[key].brightness =
                            !Number.isNaN(x) ? x : foundProps[i+5];
                    }
                } else {
                    commandObj.properties[key] = foundProps[i];
                }

            } else {
                let x = parseInt(foundProps[i]);
                commandObj.properties[key] = !Number.isNaN(x) ? x : foundProps[i];
            }
            i++;
        }
        actionObj['commands'].push(commandObj);
    }

}

function strToArr(str) {
    return str == '' ? [] : str.replaceAll(', ', ',').split(',');
}

async function sendToServer(data) {
    const res = await fetch('/saveactions', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ actions: data })
    });
    let ans = await res.json();
    console.log(ans.msg);
    location.reload();
}