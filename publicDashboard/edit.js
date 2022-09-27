const opt_actions = document.getElementById('opt_actions');
const btn_add_redeem = document.getElementById('btn_add_redeem');
const btn_save_actions = document.getElementById('btn_save_actions');

btn_add_redeem.onclick = () => {
    let sampleAction = {
        name: "NEW_ACTION",
        desc: "",
        targetSources: [],
        needsVisibleSources: false,
        incompatibilities: [],
        commands: []
    };

    let actionContainer = document.createElement('div');
    actionContainer.className = 'action';
    actionContainer.append(getActionHeader('NEW_ACTION'));
    actionContainer.append(getActionCollapse(sampleAction));

    opt_actions.append(actionContainer);
    window.scrollTo(0, document.body.scrollHeight);
}

btn_save_actions.onclick = () => {
    btn_save_actions.disabled = true;
    saveToJson(opt_actions);
}

function fillEdit(actions) {
    for (let action of actions) {
        let actionContainer = document.createElement('div');
        actionContainer.className = 'action';
        actionContainer.append(getActionHeader(action.name));
        actionContainer.append(getActionCollapse(action));

        opt_actions.append(actionContainer);
    }
}

function getActionHeader(name) {
    let header = document.createElement('div');
    header.className = 'action_header';

    let spanName = document.createElement('span');
    spanName.className = 'action_name';
    spanName.innerHTML = name

    let editBtn = document.createElement('button');
    editBtn.className = 'btn btn-success btn_edits';
    editBtn.setAttribute('data-bs-toggle', 'collapse');
    editBtn.setAttribute('data-bs-target', '#collapse_' + spaceToUnderscore(name));
    editBtn.setAttribute('aria-expanded', 'false');
    editBtn.setAttribute('aria-controls', 'collapse_' + spaceToUnderscore(name));
    editBtn.innerHTML = 'Edit';

    let testBtn = document.createElement('button');
    testBtn.className = 'btn btn-primary btn_edits';
    testBtn.innerHTML = 'Test';
    testBtn.setAttribute('onclick', 'testAction(this)');

    let deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn btn-danger btn_edits';
    deleteBtn.innerHTML = 'Delete';
    deleteBtn.setAttribute('onclick', 'deleteAction(this)');

    /* +--------------------------------+ */
    /* |             Layout             | */
    /* +--------------------------------+ */

    let table = document.createElement('table');
    table.className = 'no_border';

    let tr = document.createElement('tr');
    tr.className = 'no_border';

    let ftd = document.createElement('td');
    ftd.className = 'no_border name_col';

    let std = document.createElement('td');
    std.className = 'no_border';

    ftd.append(spanName);
    std.append(editBtn);
    std.append(testBtn);
    std.append(deleteBtn);

    tr.append(ftd);
    tr.append(std);

    table.append(tr);
    header.append(table);

    return header;
}

function testAction(action) {
    startAction(action.parentNode.parentNode.firstChild.firstChild.innerHTML ?? 'UnknownAction');
}

function deleteAction(action) {
    let confirmMsg = 'Do you really want to delete action \''
        + action.parentNode.parentNode.firstChild.firstChild.innerHTML + '\'?';
    if (confirm(confirmMsg)) {
        action.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
    }
}

function getActionCollapse(action) {
    let collapse = document.createElement('div');
    collapse.className = 'collapse';
    collapse.id = 'collapse_' + spaceToUnderscore(action.name);

    let hr = document.createElement('hr');
    collapse.append(hr);

    let table = document.createElement('table');
    table.append(getFirstLine(action.name, action.desc));
    table.append(getSecondLine(action.targetSources,
                               action.needsVisibleSources,
                               action.incompatibilities));
    table.append(getThirdLine(action.commands));

    collapse.append(table);

    return collapse;
}

function getFirstLine(name, desc) {
    let tr = document.createElement('tr');

    /* +--------------------------------+ */
    /* |         First TD (name)        | */
    /* +--------------------------------+ */
    let ftd = document.createElement('td');

    let inputName = document.createElement('input');
    inputName.className = 'form-control';
    inputName.setAttribute('type', 'text');
    inputName.setAttribute('value', name);
    inputName.setAttribute('placeholder', 'Action name - e.g. Camera Blur');

    let nameAlt = document.createElement('div');
    nameAlt.innerHTML = 'Actions names must be unique';
    nameAlt.className = 'form-text';

    ftd.append(inputName);
    ftd.append(nameAlt);

    /* +--------------------------------+ */
    /* |        Second TD (desc)        | */
    /* +--------------------------------+ */
    let std = document.createElement('td');
    std.setAttribute('colspan', '2');

    let inputDesc = document.createElement('input');
    inputDesc.className = 'form-control';
    inputDesc.setAttribute('type', 'text');
    inputDesc.setAttribute('value', desc);
    inputDesc.setAttribute('placeholder', 'Action description');

    let descAlt = document.createElement('div');
    descAlt.innerHTML = 'This field is optionnal';
    descAlt.className = 'form-text';

    std.append(inputDesc);
    std.append(descAlt);

    tr.append(ftd);
    tr.append(std);

    return tr;
}

function TGSChange(el) {
    if (el.value == '') {
        el.parentNode.parentNode.firstChild.nextSibling.lastChild.value = 'No';
        el.parentNode.parentNode.firstChild.nextSibling.lastChild.disabled = true;
    } else {
        el.parentNode.parentNode.firstChild.nextSibling.lastChild.disabled = false;
    }
}

function getSecondLine(targetSources, needsVisibleSources, incompatibilities) {
    let tr = document.createElement('tr');

    /* +--------------------------------+ */
    /* |    First TD (target source)    | */
    /* +--------------------------------+ */
    let ftd = document.createElement('td');

    let inputTS = document.createElement('input');
    inputTS.className = 'form-control';
    inputTS.setAttribute('type', 'text');
    inputTS.setAttribute('value', targetSources.join(', '));
    inputTS.setAttribute('placeholder', 'Action target sources');
    inputTS.setAttribute('onkeyup', 'TGSChange(this)');

    let tsAlt = document.createElement('div');
    tsAlt.className = 'form-text';
    tsAlt.innerHTML = 'Usually these are your camera sources';

    ftd.append(inputTS);
    ftd.append(tsAlt);

    /* +---------------------------------+ */
    /* | Second TD (needsVisibleSources) | */
    /* +---------------------------------+ */
    let std = document.createElement('td');

    let span = document.createElement('span');
    span.innerHTML = 'Target source has to be visible ';

    std.append(span);
    std.append(getYesNo(needsVisibleSources, true));

    /* +--------------------------------+ */
    /* |  Third TD (incompatibilities)  | */
    /* +--------------------------------+ */
    let ttd = document.createElement('td');

    let inputIncomps = document.createElement('input');
    inputIncomps.className = 'form-control';
    inputIncomps.setAttribute('type', 'text');
    inputIncomps.setAttribute('value', incompatibilities?.join() ?? '');
    inputIncomps.setAttribute('placeholder', 'Action incompatibilities');

    let icompsAlt = document.createElement('div');
    icompsAlt.className = 'form-text';
    icompsAlt.innerHTML = 'If multiple, separate with commas';

    ttd.append(inputIncomps);
    ttd.append(icompsAlt);


    tr.append(ftd);
    tr.append(std);
    tr.append(ttd);

    return tr;
}

function getThirdLine(commands) {
    let tr = document.createElement('tr');
    let td = document.createElement('td');
    td.setAttribute('colspan', '3');

    let span = document.createElement('span');
    span.innerHTML = 'Commands';

    let btnAddCommand = document.createElement('button');
    btnAddCommand.className = 'btn btn-success btn_add_command';
    btnAddCommand.innerHTML = 'Add command';
    btnAddCommand.setAttribute('onclick', 'addCommand(this)');

    td.append(span);
    td.append(btnAddCommand);
    td.append(getCommandTable(commands));

    tr.append(td);

    return tr;
}

function getCommandTable(commands) {
    let table = document.createElement('table');

    for (let command of commands) {
        let tr = document.createElement('tr');
        tr.append(getCommandsDropdown(command.name));
        tr.append(getCommandSettings(command));
        tr.append(getDeleteCommand());

        table.append(tr);
    }

    return table;
}

function getCommandsDropdown(commandName = '') {
    let td = document.createElement('td');
    let select = document.createElement('select');
    select.setAttribute('onchange', 'changedCommandDropdown(this)');

    let commandList = [
        'createAudioSource', 'createColorFilter', 'createFreezeFilter',
        'createScrollFilter', 'createSharpenFilter', 'deleteFilter', 'deleteSource',
        'displaySourceEvery', 'displayFilter', 'displaySource',
        'saveScreenshot', 'setFilterDelay', 'setFilterRotation',
        'setSourcePosition', 'setSourceScale', 'wait'
    ];

    for (let com of commandList) {
        let opt = document.createElement('option');
        if (com == commandName) {
            opt.setAttribute('selected', 'true');
        }
        opt.innerHTML = com;
        select.append(opt);
    }

    td.append(select);

    return td;
}

function getCommandSettings(command = {}) {
    let td = document.createElement('td');
    switch (command.name) {
        case 'createAudioSource':
            td.append(getSpan('Source name'));
            td.append(getSimpleInput(command.properties.sourceName));
            td.append(getSpan('Scene name'));
            td.append(getSimpleInput(command.properties.sceneName));
            td.append(getSpan('File path'));
            td.append(getSimpleInput(command.properties.filePath));
            break;
        case 'createColorFilter':
            td.append(getSpan('Source name'));
            td.append(getSimpleInput(command.properties.sourceName));
            td.append(getSpan('Filter name'));
            td.append(getSimpleInput(command.properties.filterName));
            td.append(getSpan('Contrast'));
            td.append(getSimpleInput(command.properties.colorSettings.contrast ?? 0));
            td.append(getSpan('Gamma'));
            td.append(getSimpleInput(command.properties.colorSettings.gamma ?? 0));
            td.append(getSpan('Hue shift'));
            td.append(getSimpleInput(command.properties.colorSettings.hue_shift ?? 0));
            td.append(getSpan('Opacity'));
            td.append(getSimpleInput(command.properties.colorSettings.opacity ?? 0));
            td.append(getSpan('Saturation'));
            td.append(getSimpleInput(command.properties.colorSettings.saturation ?? 0));
            td.append(getSpan('Brightness'));
            td.append(getSimpleInput(command.properties.colorSettings.brightness ?? 0));
            break;

        case 'createFreezeFilter':
        case 'deleteFilter':
            td.append(getSpan('Source name'));
            td.append(getSimpleInput(command.properties.sourceName));
            td.append(getSpan('Filter name'));
            td.append(getSimpleInput(command.properties.filterName));
            break;

        case 'createScrollFilter':
            td.append(getSpan('Source name'));
            td.append(getSimpleInput(command.properties.sourceName));
            td.append(getSpan('Filter name'));
            td.append(getSimpleInput(command.properties.filterName));
            td.append(getSpan('Speed'));
            td.append(getSimpleInput(command.properties.speedX));
            break;

        case 'createSharpenFilter':
            td.append(getSpan('Source name'));
            td.append(getSimpleInput(command.properties.sourceName));
            td.append(getSpan('Filter name'));
            td.append(getSimpleInput(command.properties.filterName));
            td.append(getSpan('Sharpness'));
            td.append(getSimpleInput(command.properties.sharpness));
            break;

        case 'deleteSource':
            td.append(getSpan('Scene name'));
            td.append(getSimpleInput(command.properties.sceneName));
            td.append(getSpan('Source name'));
            td.append(getSimpleInput(command.properties.sourceName));
            break;

        case 'displayFilter':
            td.append(getSpan('Source name'));
            td.append(getSimpleInput(command.properties.sourceName));
            td.append(getSpan('Filter name'));
            td.append(getSimpleInput(command.properties.filterName));
            td.append(getSpan('Display'));
            td.append(getYesNo(command.properties.isEnabled));
            break;

        case 'displaySource':
            td.append(getSpan('Scene name'));
            td.append(getSimpleInput(command.properties.sceneName));
            td.append(getSpan('Source name'));
            td.append(getSimpleInput(command.properties.sourceName));
            td.append(getSpan('Display'));
            td.append(getYesNo(command.properties.isVisible));
            break;

        case 'displaySourceEvery':
            td.append(getSpan('Scene name'));
            td.append(getSimpleInput(command.properties.sceneName));
            td.append(getSpan('Source name'));
            td.append(getSimpleInput(command.properties.sourceName));
            td.append(getSpan('Duration'));
            td.append(getSimpleInput(command.properties.duration));
            td.append(getSpan('Interval'));
            td.append(getSimpleInput(command.properties.interval));
            break;

        case 'saveScreenshot':
            td.append(getSpan('Source name'));
            td.append(getSimpleInput(command.properties.sourceName));
            td.append(getSpan('Folder path'));
            td.append(getSimpleInput(command.properties.path));
            break;

        case 'setFilterDelay':
            td.append(getSpan('Source name'));
            td.append(getSimpleInput(command.properties.sourceName));
            td.append(getSpan('Filter name'));
            td.append(getSimpleInput(command.properties.filterName));
            td.append(getSpan('Delay'));
            td.append(getSimpleInput(command.properties.delay));
            break;

        case 'setFilterRotation':
            td.append(getSpan('Source name'));
            td.append(getSimpleInput(command.properties.sourceName));
            td.append(getSpan('Filter name'));
            td.append(getSimpleInput(command.properties.filterName));
            td.append(getSpan('Rotation'));
            td.append(getSimpleInput(command.properties.rotation));
            break;

        case 'setSourcePosition':
            td.append(getSpan('Scene name'));
            td.append(getSimpleInput(command.properties.sceneName));
            td.append(getSpan('Source name'));
            td.append(getSimpleInput(command.properties.sourceName));
            td.append(getSpan('Position X'));
            td.append(getSimpleInput(JSON.stringify(command.properties.position.x)?.replaceAll('"', '') ?? ''));
            td.append(getSpan('Position Y'));
            td.append(getSimpleInput(JSON.stringify(command.properties.position.y)?.replaceAll('"', '') ?? ''));
            break;

        case 'setSourceScale':
            td.append(getSpan('Scene name'));
            td.append(getSimpleInput(command.properties.sceneName));
            td.append(getSpan('Source name'));
            td.append(getSimpleInput(command.properties.sourceName));
            td.append(getSpan('Scale X'));
            td.append(getSimpleInput(JSON.stringify(command.properties.scale.x)?.replaceAll('"', '') ?? ''));
            td.append(getSpan('Scale Y'));
            td.append(getSimpleInput(JSON.stringify(command.properties.scale.y)?.replaceAll('"', '') ?? ''));
            break;

        case 'wait':
            td.append(getSpan('Delay (ms)'));
            td.append(getSimpleInput(command.properties.delay));
            break;

        default:
            td.append(getSpan('Unknown parameters for specified command'));
            break;
    }
    return td;
}

function getSpan(text) {
    let span = document.createElement('span');
    span.innerHTML = text;
    return span;
}

function getSimpleInput(value) {
    let input = document.createElement('input');
    input.setAttribute('type', 'text');
    input.setAttribute('value', value);
    return input;
}

function getDeleteCommand() {
    let td = document.createElement('td');
    let icon = document.createElement('i');
    icon.className = 'fa fa-trash-o';
    icon.setAttribute('style', 'font-size:32px;color:red');
    icon.setAttribute('onclick', 'deleteCommand(this)');
    td.append(icon);
    return td;
}

function getYesNo(yes, disabled = false) {
    let select = document.createElement('select');
    let optYes = document.createElement('option');
    optYes.innerHTML = 'Yes';
    optYes.setAttribute('value', 'Yes');
    let optNo = document.createElement('option');
    optNo.innerHTML = 'No';
    optNo.setAttribute('value', 'No');
    if (yes) {
        optYes.setAttribute('selected', 'true');
    } else {
        optNo.setAttribute('selected', 'true');
    }
    select.append(optYes);
    select.append(optNo);
    select.disabled = disabled;

    return select;
}

function addCommand(obj) {
    let newCommand = {
        name: 'displaySource',
        properties: {
            sceneName: '<scene_name>',
            sourceName: '<source_name>',
            isVisible: true
        }
    };

    let tr = document.createElement('tr');
    tr.append(getCommandsDropdown('displaySource'));
    tr.append(getCommandSettings(newCommand));
    tr.append(getDeleteCommand());

    obj.nextSibling.append(tr);
}

function deleteCommand(obj) {
    obj.parentNode.parentNode.remove();
}

function changedCommandDropdown(obj) {
    obj.parentNode.nextSibling.remove();
    let parentTr = obj.parentNode.parentNode;
    let deleteTd = parentTr.lastChild;
    let newCommand = nameToCommand(obj.value);
    let newNode = getCommandSettings(newCommand);
    parentTr.insertBefore(newNode, deleteTd);
}

function nameToCommand(commandName) {
    let newCommand = {
        name: commandName
    };
    switch (commandName) {
        case 'createAudioSource':
            newCommand['properties'] = {
                sourceName: '',
                sceneName: '',
                filePath: ''
            };
            break;
        case 'createColorFilter':
            newCommand['properties'] = {
                sourceName: '',
                filterName: '',
                colorSettings: {
                    contrast: 0,
                    gamma: 0,
                    hue_shift: 0,
                    opacity: 1,
                    saturation: 0,
                    brightness: 0
                }
            };
            break;

        case 'createFreezeFilter':
        case 'deleteFilter':
            newCommand['properties'] = {
                sourceName: '',
                filterName: ''
            };
            break;

        case 'createScrollFilter':
            newCommand['properties'] = {
                sourceName: '',
                filterName: '',
                speedX: 0
            };
            break;

        case 'createSharpenFilter':
            newCommand['properties'] = {
                sourceName: '',
                filterName: '',
                sharpness: 1
            };
            break;

        case 'deleteSource':
            newCommand['properties'] = {
                sceneName: '',
                sourceName: ''
            };
            break;

        case 'displayFilter':
            newCommand['properties'] = {
                sourceName: '',
                filterName: '',
                isEnabled: true
            };
            break;

        case 'displaySource':
            newCommand['properties'] = {
                sceneName: '',
                sourceName: '',
                isVisible: true
            };
            break;

        case 'displaySourceEvery':
            newCommand['properties'] = {
                sceneName: '',
                sourceName: '',
                duration: 5000,
                interval: 60000
            };
            break;

        case 'saveScreenshot':
            newCommand['properties'] = {
                sourceName: '',
                path: ''
            };
            break;

        case 'setFilterDelay':
            newCommand['properties'] = {
                sourceName: '',
                filterName: '',
                delay: 1000
            };
            break;

        case 'setFilterRotation':
            newCommand['properties'] = {
                sourceName: '',
                filterName: '',
                rotation: 0
            };
            break;

        case 'setSourcePosition':
            newCommand['properties'] = {
                sceneName: '',
                sourceName: '',
                position: {}
            };
            break;

        case 'setSourceScale':
            newCommand['properties'] = {
                sceneName: '',
                sourceName: '',
                scale: {}
            };
            break;

        case 'wait':
            newCommand['properties'] = {
                delay: 1000
            };
            break;

        default:
            console.log('Error while changing command - Unknown new command');
            break;
    }
    return newCommand;
}

function spaceToUnderscore(str) {
    return str.replaceAll(' ', '_');
}