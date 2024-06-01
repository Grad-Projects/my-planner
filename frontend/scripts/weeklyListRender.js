
let weekViewList = document.getElementById("weekListView");

let daysOfWeek = ["Monday", "Tuesday", "Wednesday","Thursday","Friday","Saturday","Sunday"];
var now = dayjs();
makeWeekList();


function makeWeekList()
{
    const start = now.day();
    let counter = 0;
        for (let i = start-1; i < daysOfWeek.length + start-1; i++) 
        {
            const outerListNode = document.createElement("li");
            const listNode = document.createElement("ul");
            const innerListNodeDay = document.createElement("li");
            const innerListNodeDate = document.createElement("li");
            const textnodeDay = document.createTextNode(daysOfWeek[i % daysOfWeek.length]);
            const textnodeDate = document.createTextNode(now.date() + counter);
            innerListNodeDay.appendChild(textnodeDay);
            innerListNodeDate.appendChild(textnodeDate);
            listNode.appendChild(innerListNodeDay);
            listNode.appendChild(innerListNodeDate);
            outerListNode.appendChild(listNode);
            weekViewList.appendChild(outerListNode);
            counter++;
        }
}

