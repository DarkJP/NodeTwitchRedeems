const action_cards = document.getElementById('action_cards');

const btn_dashboard = document.getElementById('btn_dashboard');
const btn_edit = document.getElementById('btn_edit');
const btn_settings = document.getElementById('btn_settings');
const btn_help = document.getElementById('btn_help');

const div_dashboard = document.getElementById('div_dashboard');
const div_edit = document.getElementById('div_edit');
const div_settings = document.getElementById('div_settings');
const div_help = document.getElementById('div_help');

const btnXL = document.getElementById('btnXL');
const btnRL = document.getElementById('btnRL');

const btn_auth = document.getElementById('btn_auth');

btn_dashboard.onclick = () => {
    div_edit.style.display = 'none';
    div_settings.style.display = 'none';
    div_help.style.display = 'none';
    div_dashboard.style.display = 'block';
}
btn_edit.onclick = () => {
    div_dashboard.style.display = 'none';
    div_settings.style.display = 'none';
    div_help.style.display = 'none';
    div_edit.style.display = 'block';
}
btn_settings.onclick = () => {
    div_dashboard.style.display = 'none';
    div_edit.style.display = 'none';
    div_help.style.display = 'none';
    div_settings.style.display = 'block';
}
btn_help.onclick = () => {
    div_dashboard.style.display = 'none';
    div_edit.style.display = 'none';
    div_settings.style.display = 'none';
    div_help.style.display = 'block';
}

document.addEventListener("DOMContentLoaded", getActions);

async function getActions() {

    let authCode = document.location.search.substring(6, document.location.search.indexOf('&'));
    if (authCode != '') {
        const res = await fetch('/creds', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ code: authCode })
        });
        let ans = await res.json();
        window.close();
    }

    setLinkPorts();

    let actionRes = await fetch('/getactions', {method: 'GET'});
    let actions = await actionRes.json();
    actions = JSON.parse(actions.actions);

    fillDashboard(actions);
    fillEdit(actions);
}

async function setLinkPorts() {
    let res = await fetch('/getports', {method: 'GET'});
    let ports = await res.json();
    btnRL.setAttribute('href', 'http://localhost:' + ports.ports.p2);
}

async function startAction(name) {

    const res = await fetch('/action', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ actionName: name })
    });
    let ans = await res.json();

    let msg = ans.action?.msg ?? 'Server sent no response';
    console.log(msg);
}

btn_auth.onclick = async () => {

    const res = await fetch('/getclientid', {method: 'GET'});
    let ans = await res.json();

    let codeReqStr =
        'https://id.twitch.tv/oauth2/authorize?client_id='
        + ans.clientId
        + '&redirect_uri='
        + 'http://localhost:621'
        + '&response_type=code&scope='
        + 'channel:read:redemptions+user:read:email+chat:read+chat:edit'

    window.open(codeReqStr, '_blank').focus();
}