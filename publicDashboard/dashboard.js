function fillDashboard(actions) {
    for (let action of actions) {
        action_cards.append(getActionCard(action.name, action.desc));
    }
}

function getActionCard(name, desc) {
    let card = document.createElement('div');
    card.className = 'card';

    let cardBody = document.createElement('div');
    cardBody.className = 'card-body';

    let cardTitle = document.createElement('h5');
    cardTitle.className = 'card-title';
    cardTitle.innerHTML = name;

    let cardText = document.createElement('p');
    cardText.className = 'card-text';
    cardText.innerHTML = desc == 'undefined'
        ? '' : desc == undefined ? '' : desc;

    let cardFooter = document.createElement('div');
    cardFooter.className = 'card-footer';

    let button = document.createElement('button');
    button.innerHTML = 'Start';
    button.setAttribute('onclick', `startAction('${name}')`);
    button.className = 'btn btn-success';

    cardBody.append(cardTitle);
    cardBody.append(cardText);
    cardFooter.append(button);
    card.append(cardBody);
    card.append(cardFooter);

    return card;
}