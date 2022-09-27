const socket = io();

const span_data_since = 
    document.getElementById('span_data_since');
const span_redeem_count = 
    document.getElementById('span_redeem_count');
const span_redeem_cost =
    document.getElementById('span_redeem_cost');
const leaderboard_table =
    document.getElementById('leaderboard_table');
const leaderboard_table_header =
    document.getElementById('leaderboard_table_header');

socket.on('boardData', boardData => {

    let board = JSON.parse(boardData);
    console.log(board);

    span_data_since.innerHTML = 'Data since: ' + board.dataSince;
    leaderboard_table.innerHTML = '';
    leaderboard_table_header.innerHTML = '';

    span_redeem_cost.innerHTML =
        'Total cost of redeems: '
        + '<span class="totaltd">' + board.totalcost
        + '</span>';

    if (board.redeems.length == 0) {
        leaderboard_table.innerHTML = 'No redeems yet!';
        return;
    }

    /* Get all the redeems from all users */
    let columnNames = [];
    for (let redeem of board.redeems) {
        columnNames = columnNames.concat(Object.keys(redeem.score));
    }
    /* Delete duplicates */
    columnNames = [...new Set(columnNames)];

    /* Loop on columns to create ths (redeem names) */
    let tr = document.createElement('tr');
    let emptyth = document.createElement('th');
    tr.append(emptyth);

    columnNames.forEach((redeemName, i) => {
        let th = document.createElement('th');
        th.innerHTML = redeemName;
        th.setAttribute('onclick', 'sortTable(' + (i + 1) + ')');
        th.setAttribute('style', 'cursor: pointer;');
        tr.append(th);
    });

    leaderboard_table.append(tr);

    /* Loop on users */
    for (let redeem of board.redeems) {
        let usertr = document.createElement('tr');
        let usernameth = document.createElement('td');
        usernameth.innerHTML = redeem['displayName'];
        usernameth.className = 'tableUserName';
        usertr.append(usernameth);

        /* Loop on columns to create tds (users scores) */
        for (let redeemName of columnNames) {
            let scoretd = document.createElement('td');
            scoretd.innerHTML = redeem.score[redeemName] ?? '';
            usertr.append(scoretd);
        }

        leaderboard_table.append(usertr);
    }

    /* Create totals array */
    let totals = Array(leaderboard_table.rows[1].cells.length).fill(0, 1);
    totals[0] = 'Total';

    for (let i = 1; i < leaderboard_table.rows.length; i++) {
        let row = leaderboard_table.rows[i].children;
        for (let j = 1; j < row.length; j++) {
            let val = parseInt(row[j].innerHTML);
            if (Number.isNaN(val)) val = 0;
            totals[j] += val;
        }
    }

    /* Display in table */
    let totaltr = document.createElement('tr');
    let lbltotaltd = document.createElement('td');
    lbltotaltd.className = 'totaltd';
    lbltotaltd.innerHTML = totals[0];
    totaltr.append(lbltotaltd);

    for (let i = 1; i < totals.length; i++) {
        let totaltd = document.createElement('td');
        totaltd.className = 'totaltd';
        totaltd.innerHTML = totals[i];
        totaltr.append(totaltd);
    }
    leaderboard_table_header.append(totaltr);

    /* Compute all-redeems total */
    totals.shift();
    const initVal = 0;
    const sum = totals.reduce((a, b) => a + b, initVal);
    span_redeem_count.innerHTML =
        'Total number of redeems: '
        + '<span class="totaltd">' + sum
        + '</span>';

});

function sortTable(n) {
    let rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
    switching = true;

    /* Default sorting direction */
    dir = "desc";

    /* Loop until no switching has been done */
    while (switching) {
        switching = false;
        rows = leaderboard_table.rows;

        /* Loop through all table rows except the first
         * which contains headers */
        for (i = 1; i < (rows.length - 1); i++) {
            shouldSwitch = false;

            /* Compare current and next row of column n */
            x = rows[i].getElementsByTagName("TD")[n];
            y = rows[i + 1].getElementsByTagName("TD")[n];

            if (dir == "asc") {
                if (Number(x.innerHTML) > Number(y.innerHTML)) {
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (Number(x.innerHTML) < Number(y.innerHTML)) {
                    shouldSwitch = true;
                    break;
                }
            }
        }

        if (shouldSwitch) {
            /* Switch rows */
            rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
            switching = true;
            switchcount ++;  

        } else {
            /* No switches -> change sort order */
            if (switchcount == 0 && dir == "desc") {
                dir = "asc";
                switching = true;
            }
        }
    }
}