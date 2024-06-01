const dayjs = require('dayjs');

let weekViewList = document.getElementById("weekListView");

let daysOfWeek = ["Monday", "Tuesday", "Wednesday","Thursday","Friday","Saturday","Sunday"];

makeWeekList();

function makeWeekList()
{
    daysOfWeek.forEach(day => {
        const node = document.createElement("li");
        const textnode = document.createTextNode(day);
        node.appendChild(textnode);
        weekViewList.appendChild(node);
    });

}

