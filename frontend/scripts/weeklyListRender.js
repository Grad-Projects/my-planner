
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
            const innerListNodeEvents = document.createElement("li");
            const textnodeDay = document.createTextNode(daysOfWeek[i % daysOfWeek.length] + " " + (now.date() + counter));
            const textnodeEvents = document.createTextNode("No events");
            innerListNodeDay.appendChild(textnodeDay);
            innerListNodeEvents.appendChild(textnodeEvents);
            listNode.appendChild(innerListNodeDay);
            listNode.appendChild(innerListNodeEvents);
            outerListNode.appendChild(listNode);
            outerListNode.classList.add("weekItem")
            weekViewList.appendChild(outerListNode);
            counter++;
        }
}
