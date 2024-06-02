
let weekViewList = document.getElementById("weekListView");

let daysOfWeek = ["Sunday","Monday", "Tuesday", "Wednesday","Thursday","Friday","Saturday"];
var now = dayjs();
makeWeekList();


function makeWeekList()
{
    const start = now.day();
    console.log("Start: " + start);
    let counter = 0;
        for (let i = start; i < daysOfWeek.length + start; i++) 
        {
            const outerListNode = document.createElement("li");
            const listNode = document.createElement("ul");
            const innerListNodeDay = document.createElement("li");
            const innerListNodeEvents = document.createElement("li");
            console.log(i % daysOfWeek.length);
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

