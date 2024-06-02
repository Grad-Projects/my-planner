window.deleteNoteItem = deleteNoteItem;
window.deleteCheckItem = deleteCheckItem;
window.deleteTimeItem = deleteTimeItem;
window.popUpCreateNote = popUpCreateNote;
window.addNoteItem = addNoteItem;
window.cancelAddNote = cancelAddNote;
window.addCheckItem = addCheckItem;
window.popUpCreateCheckListItem = popUpCreateCheckListItem;
window.changeIcon = changeIcon;
window.addTimeItem = addTimeItem;
window.createCalendarEvent = createCalendarEvent;
window.closeCalendar = closeCalendar;
window.showCalendar = showCalendar;
window.switchMonth = switchMonth;

let noteList = document.getElementById("noteList");
let overlay = document.getElementById("overlay");
let notePopUp = document.getElementById("notePopUp");
let checkListPopUp = document.getElementById("checkListPopUp")
let checkList = document.getElementById("checkList");
let timeList = document.getElementById("timeList");
let eventPopUp = document.getElementById("eventPopUp");

let noteTitleInput = document.getElementById("noteTitle");
let noteContentInput = document.getElementById("noteContent");
let checkListContent = document.getElementById("checkListDesc");
let timePopUp = document.getElementById("timePopUp");
let timeTrackContent = document.getElementById("timeTrackDesc");
let eventTitle = document.getElementById("eventTitle");
let eventDesc = document.getElementById("eventDesc");
let eventDate = document.getElementById("eventDate");
let eventTime = document.getElementById("eventTime");
let calendar = document.getElementById("calendar");
let monthYear = document.getElementById("monthTitle");
let eventLength = document.getElementById("inputEventLength")


let weekViewList = document.getElementById("weekListView");

let daysOfWeek = ["Sunday","Monday", "Tuesday", "Wednesday","Thursday","Friday","Saturday"];
var now = dayjs();

let calendarDayIDs = [
    "cal1", "cal2", "cal3", "cal4", "cal5", "cal6", "cal7",
    "cal8", "cal9", "cal10", "cal11", "cal12", "cal13",
    "cal14", "cal15", "cal16", "cal17", "cal18", "cal19",
    "cal20", "cal21", "cal22", "cal23", "cal24", "cal25",
    "cal26", "cal27", "cal28", "cal29", "cal30", "cal31",
    "cal32", "cal33", "cal34", "cal35", "cal36", "cal37",
    "cal38", "cal39", "cal40", "cal41", "cal42"
];

let months = [
    "January","February","March","April","May","June","July","August","September","October","November","December"
]

document.getElementById("eventTime").addEventListener('input', function(event) {
    const value = event.target.value;
    const minutes = value.split(':')[1];
    if (minutes !== '00') {
        // Reset to the closest whole hour if minutes are not zero
        const hours = value.split(':')[0];
        event.target.value = hours + ':00';
    }
});

let testEvents = [
    {
        eventTitle: "event1",
        eventDescription: "this is an event!",
        eventDate: "4-6-2024",
        eventStartTime: "13:00",
        eventLength: 2,

    },
    {
        eventTitle: "Water Plants Day",
        eventDescription: "Gotta water the plants on this day",
        eventDate: "4-6-2024",
        eventStartTime: "09:00",
        eventLength: 2,

    },
    {
        eventTitle: "Bug Day",
        eventDescription: "day all about bugs",
        eventDate: "8-6-2024",
        eventStartTime: "15:00",
        eventLength: 2,

    }
];

makeWeekList();

var currentDate;
function cancelAddNote()
{
    noteTitleInput.value = "";
    noteContentInput.value = "";
    checkListContent.value = "";
    timeTrackContent.value = "";

    overlay.classList.add("hide");
    notePopUp.classList.add("hide");
    checkListPopUp.classList.add("hide");
    timePopUp.classList.add("hide");
    eventPopUp.classList.add("hide");
}

function deleteNoteItem(event)
{
    const item = event.target;
    const parent1 = item.parentElement;
    parent1.remove();
}

function deleteTimeItem(event)
{
    const item = event.target;
    const parent1 = item.parentElement;
    parent1.remove();
}

function deleteCheckItem(event)
{
    const item = event.target;
    const parent1 = item.parentElement;
    const parent2 = parent1.parentElement;
    parent2.remove();
}

function popUpCreateNote()
{
    overlay.classList.remove("hide");
    notePopUp.classList.remove("hide");
}

function popUpCreateCheckListItem()
{
    overlay.classList.remove("hide");
    checkListPopUp.classList.remove("hide");
}

function popUpCreateTimeItem()
{
    overlay.classList.remove("hide");
    timePopUp.classList.remove("hide");
}

function popUpCreateEvent(){
    overlay.classList.remove("hide");
    eventPopUp.classList.remove("hide");
}

function addNoteItem(){
    const noteTitle = noteTitleInput.value;
    const noteContent = noteContentInput.value;

    if(noteTitle != "" && noteContent != "")
    {
    noteTitleInput.value = "";
    noteContentInput.value = "";
    overlay.classList.add("hide");
    notePopUp.classList.add("hide");

    const listNode = document.createElement("li");
    listNode.classList.add("innerCard");
    const sectionNode = document.createElement("section")
    const titleNode = document.createElement("h3");
    const contentNode = document.createElement("p");
    const dateNode = document.createElement("h4");
    
    const titleTextNode = document.createTextNode(noteTitle);
    const contentTextNode = document.createTextNode(noteContent);
    var nowDate = dayjs();
    const dateTextNode = document.createTextNode(nowDate.date() + "/" + nowDate.month() + "/" + nowDate.year());

    titleNode.appendChild(titleTextNode);
    contentNode.appendChild(contentTextNode);
    dateNode.appendChild(dateTextNode);

    sectionNode.appendChild(titleNode);
    sectionNode.appendChild(contentNode);
    sectionNode.appendChild(dateNode);

    listNode.appendChild(sectionNode);

    const spanNode = document.createElement("span");
    spanNode.setAttribute("onclick","deleteNoteItem(event)");
    spanNode.classList.add("material-symbols-outlined");
    spanNode.classList.add("deleteHolder");
    spanNode.innerText = "delete";
    listNode.appendChild(spanNode);
    noteList.appendChild(listNode);
    }
    else
    {
        alert("PUT SOME CONTENT IN THERE BIG DAWG >:(")
    }

}

function addCheckListItem()
{
    const checkContent = checkListContent.value;
    if(checkContent != "")
    {
        checkListContent.value = "";
        const listNode = document.createElement("li");
        listNode.classList.add("checkItem");
        //PERHAPS: Here when we create the item in the db we make the ID of the li element the id in the db

        const pNode = document.createElement("p");
        const checkTextNode = document.createTextNode(checkContent);
        pNode.appendChild(checkTextNode);

        const sectionNode = document.createElement("section");
        sectionNode.classList.add("checkActions");

        const checkSpan = document.createElement("span");
        checkSpan.setAttribute("onclick","changeIcon(event)");
        checkSpan.classList.add("material-symbols-outlined");
        checkSpan.classList.add("checkBox");
        const checkedTextNode = document.createTextNode("radio_button_unchecked");
        checkSpan.appendChild(checkedTextNode);

        const deleteSpan = document.createElement("span");
        deleteSpan.setAttribute("onclick","deleteCheckItem(event)");
        deleteSpan.classList.add("material-symbols-outlined");
        deleteSpan.classList.add("deleteHolder");
        deleteSpan.classList.add("checkDelete");
        const deleteTextNode = document.createTextNode("delete");
        deleteSpan.appendChild(deleteTextNode);

        listNode.appendChild(pNode);
        sectionNode.appendChild(checkSpan);
        sectionNode.appendChild(deleteSpan);
        listNode.appendChild(sectionNode);

        checkList.appendChild(listNode);

        overlay.classList.add("hide");
        checkListPopUp.classList.add("hide");
    }
    else
    {
        alert("PUT SOME CONTENT IN THERE BIG DAWG >:(")
    }
}

function addTimeItem()
{
    const timeContent = timeTrackContent.value;
    if(timeContent != "")
    {
        timeTrackContent.value = "";
        const timeListNode = document.createElement("li");
        timeListNode.classList.add("timeItem");
        const timeDescNode = document.createElement("p");
        const timeDescTextNode = document.createTextNode(timeContent);
        timeDescNode.appendChild(timeDescTextNode);
        const inputTimeNode = document.createElement("input");
        inputTimeNode.classList.add("inputTime");
        inputTimeNode.setAttribute("type","number");

        const selectTimeUnit = document.createElement("select");
        selectTimeUnit.setAttribute("name","time");

        const minOption = document.createElement("option");
        minOption.setAttribute("value","Min");
        minOption.innerText = "Min";
        const hrOption = document.createElement("option");
        hrOption.setAttribute("value","Hr");
        hrOption.innerText = "Hr";

        selectTimeUnit.appendChild(minOption);
        selectTimeUnit.appendChild(hrOption);

        const spanNode = document.createElement("span");
        spanNode.setAttribute("onclick","deleteNoteItem(event)");
        spanNode.classList.add("material-symbols-outlined");
        spanNode.classList.add("deleteHolder");
        spanNode.innerText = "delete";

        timeListNode.appendChild(timeDescNode);
        timeListNode.appendChild(inputTimeNode);
        timeListNode.appendChild(selectTimeUnit);
        timeListNode.appendChild(spanNode);

        
        timeList.appendChild(timeListNode);

        overlay.classList.add("hide");
        timePopUp.classList.add("hide");
    }
    else
    {
        alert("PUT SOME CONTENT IN THERE BIG DAWG >:(")
    }
}

function createCalendarEvent()
{
    let newEvent = 
    {
        eventTitle: eventTitle.value,
        eventDescription: eventDesc.value,
        eventDate: eventDate.value,
        eventStartTime: eventTime.value,
        eventLength: eventLength.value
    };
    console.log(newEvent);
    testEvents.push(newEvent);
    eventTitle.value = "";
    eventDesc.value = "";
    eventDate.value = "";
    eventTime.value = "";
    eventLength.value = "";
    makeWeekList();


    console.log("event created yay");
    overlay.classList.add("hide");
    eventPopUp.classList.add("hide");
}

function closeCalendar()
{
    calendar.classList.add("hide");
    overlay.classList.add("hide");
}

function showCalendar()
{
    calendar.classList.remove("hide");
    overlay.classList.remove("hide");
    openCalendarInit();
}

function switchMonth(incr)
{
    if(currentDate.month() == 11 && incr > 0){
        initializeCalendar(0,currentDate.year()+1);
    }
    else if(currentDate.month()==0 && incr < 0){
        initializeCalendar(11,currentDate.year()-1);
    }
    else{
        initializeCalendar((currentDate.month()+ incr),(currentDate.year()));
    }

     
}

function changeIcon(event){
    const item = event.target;
    const itemParent = item.parentElement;
    const checkParent = itemParent.parentElement; //Here we can get the parent container of the checkList item
                                                  //It might be a good idea to make the id of the item the id in the database so we set the checked/unchecked
    console.log(checkParent);
    if(item.innerText == "radio_button_unchecked"){
        item.innerText = "check_circle";
    }else{
        item.innerText = "radio_button_unchecked";
    }
}

function openCalendarInit()
{
    let now = dayjs();
    initializeCalendar(now.month(),now.year());
}

function initializeCalendar(month, year)
{
calendarDayIDs.forEach(element => {
    let dayElement = document.getElementById(element);
    dayElement.innerText = "";
    
});

    let date = dayjs().month(month);
    date = date.date(1);
    date = date.year(year);
    currentDate = date;
    let weekDay = dayjs(date).day();
    let numDays = dayjs(date).daysInMonth();
    console.log(date);
    for (let index = 1; index <= numDays; index++) {
        let dateBox = document.getElementById("cal" + (weekDay + (index)));
        dateBox.innerText = index;
        
    }
    monthTitle.innerText = months[month] + " " + year;

}

var textNodeEvents;

function makeWeekList()
{

    while((weekViewList.getElementsByTagName("li")).length > 0) {
	    weekViewList.removeChild(weekViewList.getElementsByTagName("li")[0]);
    }

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
            //check for events here
            //populate with number of events
            let eventCounter = 0;
            console.log("CHECKING DATE: " + (now.date()+counter) + "-" + (now.month()+1) + "-" + (now.year()));
            testEvents.forEach(element => {
                console.log("CHECKED AGAINST: " + element.eventDate);
                if((+ (now.date()+counter) + "-" + (now.month()+1) + "-" + (now.year())) == element.eventDate){
                    eventCounter++;
                }
            });
            
            if(eventCounter == 0)
                {
                     textNodeEvents = document.createTextNode("No events");
                }
                else if(eventCounter == 1)
                {
                    textNodeEvents = document.createTextNode("1 Event")
                }else
                {
                    textNodeEvents = document.createTextNode(eventCounter + " Events");
                }
            
            innerListNodeDay.appendChild(textnodeDay);
            innerListNodeEvents.appendChild(textNodeEvents);
            listNode.appendChild(innerListNodeDay);
            listNode.appendChild(innerListNodeEvents);
            outerListNode.appendChild(listNode);
            outerListNode.classList.add("weekItem")
            weekViewList.appendChild(outerListNode);
            counter++;
        }
}



