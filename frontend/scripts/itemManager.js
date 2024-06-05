import {ApiHelper } from "./apiHelper.js";
import {backendUrl} from "./apiConfig.js";

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
window.popUpShowEvents = popUpShowEvents;
window.closeEvents = closeEvents;
window.popUpCreateEvent = popUpCreateEvent;
window.addCheckListItem = addCheckListItem;
window.popUpCreateTimeItem = popUpCreateTimeItem;

const baseUrl = `${backendUrl}/api/v1`;

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
let eventLength = document.getElementById("inputEventLength");
let eventListPopUp = document.getElementById("eventListPopUp");
const titleEventsPage = document.getElementById("titleEventsPage");
let counter = 0;
let tempInt = 0;
let weekViewList = document.getElementById("weekListView");
let eventListCard = document.getElementById("eventListCard");

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
    "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"
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


async function displayPageItems()
{
    displayNotes( await getNotesFromDB());
    displayCheckItems(await getCheckItemsFromDB());
    displayTimeTrackItems(await getTimeTrackFromDB());
}

displayPageItems();

//Set a checked object
//updating time tracker time
//"deleting"

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
    markItemDeleted(parent1.id);
    parent1.remove();
}

function deleteTimeItem(event)
{
    const item = event.target;
    const parent1 = item.parentElement;
    markItemDeleted(parent1.id);
    parent1.remove();
}

function deleteCheckItem(event)
{
    const item = event.target;
    const parent1 = item.parentElement;
    const parent2 = parent1.parentElement;
    markItemDeleted(parent2.id);
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

async function popUpShowEvents(date,month,year)
{
    overlay.classList.remove("hide");
    eventListPopUp.classList.remove("hide");
    const events = await getEventsFromDB();
    console.log("DATE: " + date + " MONTH: " + months[month-1] + " YEAR: " + year);
    const thisDate = new Date();

    thisDate.setFullYear(year, month-1, date);

    //need to get date from object clicked on
    let todaysEvents = [];

    titleEventsPage.innerText = "Events for: " + date + " " +  months[month-1] +  " " + year;
    events.forEach(element => {
        const jsdate = new Date(element.start_time);
        console.log("JSDATE: " + jsdate);
        console.log("THISDATE: " + thisDate);
        if((jsdate.getFullYear() == thisDate.getFullYear()) && (jsdate.getMonth() == thisDate.getMonth()) && (thisDate.getDate() == jsdate.getDate()))
            {
                console.log("WTF???");
                todaysEvents.push(element);
            }
    });
    displayEvents(todaysEvents);
}

function closeEvents()
{
    overlay.classList.add("hide");
    eventListPopUp.classList.add("hide");
}

async function addNoteItem(){
    const noteTitle = noteTitleInput.value;
    const noteContent = noteContentInput.value;

    if(noteTitle != "" && noteContent != "")
    {
    noteTitleInput.value = "";
    noteContentInput.value = "";
    newNoteItem(noteTitle, noteContent);
    overlay.classList.add("hide");
    notePopUp.classList.add("hide");
    postNewNoteToDB(newNoteItem);
    displayPageItems();
    }
    else
    {
        alert("PUT SOME CONTENT IN THERE BIG DAWG >:(")
    }

}

async function addCheckListItem()
{
    const checkContent = checkListContent.value;
    if(checkContent != "")
    {
        await newCheckListItem(checkListContent.value);
        checkListContent.value = "";
        overlay.classList.add("hide");
        checkListPopUp.classList.add("hide");
        displayCheckItems(await getCheckItemsFromDB());

    }
    else
    {
        alert("PUT SOME CONTENT IN THERE BIG DAWG >:(")
    }
}

async function addTimeItem()
{
    if(timeTrackContent.value != "")
    { 
        let timeTrackItem = newTimeTrackItem(timeTrackContent.value,0,1);
        postNewTimeTrackItemToDB(timeTrackItem);
        overlay.classList.add("hide");
        timePopUp.classList.add("hide");
        timeTrackContent.value = "";
        displayTimeTrackItems(await getTimeTrackFromDB());
    }
    else
    {
        alert("PUT SOME CONTENT IN THERE BIG DAWG >:(")
    }
}

function createCalendarEvent()
{
    let date = new Date(eventDate.value);
    date = date.toUTCString();

    console.log("TIME: " + eventTime.value);
    const newEvent = newEventItem(eventTitle.value,eventDesc.value, date, eventTime.value, eventLength.value);
    postNewEventToDB(newEvent);
    eventTitle.value = "";
    eventDesc.value = "";
    eventDate.value = "";
    eventTime.value = "";
    eventLength.value = "";
    makeWeekList();


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
        dayElement.removeAttribute("onclick");
    });

    let date = dayjs().month(month);
    date = date.date(1);
    date = date.year(year);
    currentDate = date;
    let weekDay = dayjs(date).day();
    let numDays = dayjs(date).daysInMonth();
    for (let index = 1; index <= numDays; index++) {
        let dateBox = document.getElementById("cal" + (weekDay + (index)));
        dateBox.innerText = index;
        dateBox.classList.add("hoverCalendar");
        tempInt = index;
        dateBox.setAttribute("onclick","popUpShowEvents("+(tempInt)+"," + (currentDate.month()+1) + "," + currentDate.year() + ")");        
        
    }
    monthTitle.innerText = months[month] + " " + year;

}

var textNodeEvents;


async function makeWeekList()
{

    while((weekViewList.getElementsByTagName("li")).length > 0) {
	    weekViewList.removeChild(weekViewList.getElementsByTagName("li")[0]);
    }
    counter = 0;
    const events = await getEventsFromDB();
    const start = now.day();
        for (let i = start; i < daysOfWeek.length + start; i++) 
        {
            const outerListNode = document.createElement("li");
            tempInt = now.date() + counter;
            outerListNode.setAttribute("onclick","popUpShowEvents("+(tempInt)+","+ (now.month()+1) +"," + now.year() + ")");
            const listNode = document.createElement("ul");
            const innerListNodeDay = document.createElement("li");
            const innerListNodeEvents = document.createElement("li");
            const textnodeDay = document.createTextNode(daysOfWeek[i % daysOfWeek.length] + " " + (now.date() + counter));
            //check for events here
            //populate with number of events
            let eventCounter = 0;
            events.forEach(element => {
            const checkDate = new Date();
            checkDate.setFullYear(now.year(),now.month(),now.date()+counter);
            const elemDate = new Date(element.start_time);
                if((elemDate.getFullYear() == checkDate.getFullYear()) && (elemDate.getMonth() == checkDate.getMonth()) && (elemDate.getDate() == checkDate.getDate())){
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

async function displayNotes(notesList)
{
    console.log(notesList);
    while((noteList.getElementsByTagName("li")).length > 0) 
    {
	    noteList.removeChild(noteList.getElementsByTagName("li")[0]);
    }
    console.log("HERE NOW");
    console.log(notesList);
    notesList.forEach(item => 
    {
        if(item.is_deleted == 0)
        {
        const noteTitle = item.title;
        const noteContent = item.content;

        const listNode = document.createElement("li");
        listNode.id = "not" + item.id;
        listNode.classList.add("innerCard");
        const sectionNode = document.createElement("section")
        const titleNode = document.createElement("h3");
        const contentNode = document.createElement("p");
        //const dateNode = document.createElement("h4");
    
        const titleTextNode = document.createTextNode(noteTitle);
        const contentTextNode = document.createTextNode(noteContent);
        //var nowDate = dayjs();
        //const dateTextNode = document.createTextNode(nowDate.date() + "/" + (nowDate.month()+1) + "/" + nowDate.year());

        titleNode.appendChild(titleTextNode);
        contentNode.appendChild(contentTextNode);
        //dateNode.appendChild(dateTextNode);

        sectionNode.appendChild(titleNode);
        sectionNode.appendChild(contentNode);
        //sectionNode.appendChild(dateNode);

        listNode.appendChild(sectionNode);

        const spanNode = document.createElement("span");
        spanNode.setAttribute("onclick","deleteNoteItem(event)");
        spanNode.classList.add("material-symbols-outlined");
        spanNode.classList.add("deleteHolder");
        spanNode.innerText = "delete";
        listNode.appendChild(spanNode);
        noteList.appendChild(listNode);
        }
    });
}

function displayCheckItems(checkItemsList)
{
    while((checkList.getElementsByTagName("li")).length > 0) 
    {
        checkList.removeChild(checkList.getElementsByTagName("li")[0]);
    }
    checkItemsList.forEach(item => 
    {
        if(item.is_deleted == 0)
            {
                const checkContent = item.item;
                const listNode = document.createElement("li");
                listNode.classList.add("checkItem");
                listNode.id = "chk" + item.id;
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
            }
    });
}

function displayTimeTrackItems(timeTrackItemsList)
{
    while((timeList.getElementsByTagName("li")).length > 0) 
    {
        timeList.removeChild(timeList.getElementsByTagName("li")[0]);
    }

    timeTrackItemsList.forEach(item => {
        if(item.is_deleted == 0)
            {
                const timeContent = item.description;
                const timeLength = item.length;
                const timeUnit = item.time_unit;
                const timeListNode = document.createElement("li");
                timeListNode.id = "tim" + item.id;
                timeListNode.classList.add("timeItem");
                const timeDescNode = document.createElement("p");
                const timeDescTextNode = document.createTextNode(timeContent);
                timeDescNode.appendChild(timeDescTextNode);
                const inputTimeNode = document.createElement("input");
                inputTimeNode.classList.add("inputTime");
                inputTimeNode.setAttribute("type","number");
                inputTimeNode.value = timeLength;
        
                const selectTimeUnit = document.createElement("select");
                selectTimeUnit.setAttribute("name","time");
        
                const minOption = document.createElement("option");
                minOption.setAttribute("value","Min");
                minOption.innerText = "Min";
                const hrOption = document.createElement("option");
                hrOption.setAttribute("value","Hr");
                hrOption.innerText = "Hr";
                const secOption = document.createElement("option");
                secOption.setAttribute("value","Sec");
                secOption.innerText = "Sec";

                selectTimeUnit.appendChild(minOption);
                selectTimeUnit.appendChild(hrOption);
                selectTimeUnit.appendChild(secOption);

                switch(timeUnit) {
                    case 1:
                      // code block
                      selectTimeUnit.value = "Hr";
                      break;
                    case 2:
                      selectTimeUnit.value = "Min";
                      break;
                    case 3:
                        selectTimeUnit.value = "Sec";
                        break;
                    default:
                        selectTimeUnit.value = "Hr";
                      // code block
                  }

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
    });
}

function displayEvents(eventsList)
{
  
    console.log("here we are ye");
    //empty the display
    while((eventListCard.getElementsByTagName("li")).length > 0) {
	    eventListCard.removeChild(eventListCard.getElementsByTagName("li")[0]);
        console.log("REMOVED BITCH");
    }
    eventsList.forEach(element => {
        const date = new Date(element.start_time);

        const listNode = document.createElement("li");
        listNode.classList.add("eventCard");
        listNode.id = "evt" + element.id;

        const titleNode = document.createElement("h3");
        titleNode.classList.add("eventCardItem");
        const titleText = document.createTextNode(element.title);
        titleNode.appendChild(titleText);

        const articleNode = document.createElement("article");
        articleNode.classList.add("eventCardItem");
        const pNode = document.createElement("p");
        const descNode = document.createTextNode(element.description);
        pNode.appendChild(descNode);
        articleNode.appendChild(pNode);

        const eventSectionNode = document.createElement("section");
        eventSectionNode.classList.add("eventTimes");
        eventSectionNode.classList.add("eventCardItem");

        const dateNode = document.createElement("h3");
        const dateTextNode = document.createTextNode(date.getUTCDate() + "/" + months[date.getUTCMonth()] + "/" + date.getUTCFullYear());
        dateNode.appendChild(dateTextNode);

        const timeNode = document.createElement("h3");
        const timeTextNode = document.createTextNode(date.getUTCHours() + ":00");
        timeNode.appendChild(timeTextNode);

        const lengthNode = document.createElement("h3");
        const lengthTextNode = document.createTextNode(element.length + " hours");
        lengthNode.appendChild(lengthTextNode);

        eventSectionNode.appendChild(dateNode);
        eventSectionNode.appendChild(timeNode);
        eventSectionNode.appendChild(lengthNode);

        listNode.appendChild(titleNode);
        listNode.appendChild(articleNode);
        listNode.appendChild(eventSectionNode);

        eventListCard.appendChild(listNode);
    });
}

// ** Creates a new note item in the database **
// Parameters:
// - noteTitle: Title of the note (string)
// - noteContent: Content of the note (string)
async function newNoteItem(noteTitle, noteContent) {

    const noteObject = {
      title: noteTitle,
      content: noteContent
    };
  
    try {
      await postNewNoteToDB(noteObject);
    } catch (error) {
      console.error('Error creating new note item:', error);
    }
  }
  
  // ** Creates a new checklist item in the database **
  // Parameters:
  // - checkListItem: Text content of the checklist item (string)
  async function newCheckListItem(checkListItem) {
    const checkListItemObject = {
      item: checkListItem
    };
  
    try {
      await postNewCheckListItemToDB(checkListItemObject);
    } catch (error) {
      console.error('Error creating new note item:', error);
    }
  }
  
  // ** Creates a new time track item in the database **
  // Parameters:
  // - description: Description of the timed activity (string)
  // - length: Duration of the activity (number)
  // - time_unit: Unit of time for the length (e.g., "minutes", "hours")
  async function newTimeTrackItem(description, length, time_unit) {
    const timeTrackItemObject = {
      description: description,
      length: length,
      time_unit: time_unit
    };
  
    try {
      await postNewTimeTrackItemToDB(timeTrackItemObject);
    } catch (error) {
      console.error('Error creating new note item:', error);
    }
  }
  
  // ** Creates a new event item in the database **
  // Parameters:
  // - title: Title of the event (string)
  // - description: Description of the event (string)
  // - start_date: Start date of the event in YYYY-MM-DD format (string)
  // - start_time: Start time of the event in HH:MM format (string)
  // - length: Length of the event (number)
  async function newEventItem(title, description, start_date, start_time, length) {
    const eventItemObject = {
      title: title,
      description: description,
      start_time: start_date + "T" + start_time + ":00Z",
      length: length
    };
  
    try {
      await postNewEventToDB(eventItemObject);
    } catch (error) {
      console.error('Error creating new note item:', error);
    }
  }
  
  // ** Posts a new note object to the database **
  // Parameters:
  // - noteObject: Object containing note data (see newNoteItem function)
  async function postNewNoteToDB(noteObject) {
    const apiHelper = new ApiHelper(baseUrl);
    try {
      const response = await apiHelper.post('/create/notes', noteObject);
      console.log('Note successfully added:', response);
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
  }
  
  // ** Posts a new checklist item object to the database  **
  // Parameters:
  // - checkListObject: Object containing checklist item data (see newCheckListItem function)
  async function postNewCheckListItemToDB(checkListObject) {
    const apiHelper = new ApiHelper(baseUrl);
    try {
      const response = await apiHelper.post('/create/todo-items', checkListObject);
      console.log('CheckListItem successfully added:', response);
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
  }
  
  // ** Posts a new time track item object to the database  **
  // Parameters:
  // - timeTrackObject: Object containing time track item data (see newTimeTrackItem function)
  async function postNewTimeTrackItemToDB(timeTrackObject) {
    const apiHelper = new ApiHelper(baseUrl);
    try {
      const response = await apiHelper.post('/create/time-tracker-items', timeTrackObject);
      console.log('TimeTrackItem successfully added:', response);
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
  }

// ** Posts a new event object to the database  **
// Parameters:
// - eventObject: Object containing event item data (see newEventItem function)
async function postNewEventToDB(eventObject) {
    const apiHelper = new ApiHelper(baseUrl);
    try {
      const response = await apiHelper.post('/create/appointments', eventObject);
      console.log('Event successfully added:', response);
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
  }
  
  // ** Marks a note as deleted in the database **
  // Parameters:
  // - noteObjectID: Unique identifier of the note to delete (string)
  async function markNoteDeleted(noteObjectID) {
    const apiHelper = new ApiHelper(baseUrl);
    try {
      const response = await apiHelper.toggle('/remove/Notes/' + noteObjectID);
      console.log('Note successfully removed:', response);
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
  }
  
  // ** Marks a checklist item as deleted in the database  **
  // Parameters:
  // - checkItemObjectID: Unique identifier of the checklist item to delete (string)
  async function markCheckItemDeleted(checkItemObjectID) {
    const apiHelper = new ApiHelper(baseUrl);
    try {
      const response = await apiHelper.toggle('/remove/TodoItems/' + checkItemObjectID);
      console.log('Checklist item successfully removed:', response);
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
  }
  
  // ** Marks a time track item as deleted in the database  **
  // Parameters:
  // - timeTrackObjectID: Unique identifier of the time track item to delete (string)
  async function markTimeTrackDeleted(timeTrackObjectID) {
    const apiHelper = new ApiHelper(baseUrl);
    try {
      const response = await apiHelper.toggle('/remove/TimeTrackerItems/' + timeTrackObjectID);
      console.log('Time Tracker item successfully removed:', response);
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
  }
  
  // ** Marks a event item as deleted in the database  **
  // Parameters:
  // - eventObjectID: Unique identifier of the event item to delete (string)
  async function markEventDeleted(eventObjectID) {
    const apiHelper = new ApiHelper(baseUrl);
    try {
      const response = await apiHelper.toggle('/remove/Appointments/' + eventObjectID);
      console.log('Event successfully removed:', response);
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
  }
  
  // ** Toggles the completion status of a checklist item  **
  // Parameters:
  // - checkItemObjectID: Unique identifier of the checklist item (string)
  async function toggleCheckListItemCompleted(checkItemObjectID) {
    try {
      const response = await apiHelper.toggle('/update/todo-item-completion/' + checkItemObjectID);
      console.log('checklist item completion toggled', response);
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
  }
  
  
  
  // ** Updates the time unit of a time track item  **
  // Parameters:
  // - timeTrackObjectID: Unique identifier of the time track item (string)
  // - newTimeUnitID: Unique identifier of the new time unit (string)
  async function updateTimeTrackerTimeUnit(timeTrackObjectID, newTimeUnitID) {
    const timeUnitObject = {
      time_unit: newTimeUnitID,
    };
    try {
      const response = await apiHelper.patch('/update/time-tracker-unit/' + timeTrackObjectID, timeUnitObject);
      console.log('Time Tracker item successfully updated:', response);
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
  }
  
  // ** Updates the length of a time track item  **
  // Parameters:
  // - timeTrackObjectID: Unique identifier of the time track item (string)
  // - newLength: New length of the time track item (number)
  async function updateTimeTrackLength(timeTrackObjectID, newLength) {
  
    const lengthObject = {
      length: newLength,
    };
    try {
      const response = await apiHelper.patch('/update/time-tracker-length/' + timeTrackObjectID, lengthObject);
      console.log('Time Tracker item successfully updated:', response);
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
  }

// ** Retrieves all notes from the database  **
// Returns:
// - notes: Object containing all retrieved notes data
async function getNotesFromDB() {
  const apiHelper = new ApiHelper(baseUrl);
    console.log(apiHelper);
    let notes = [];
  
    try {
      const response = await apiHelper.get('/notes');
      console.log('Notes retrieved successfully:', response);
        
      if (response) {
        notes = response;
      }
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
  
    return notes;
  }
  
  // ** Retrieves all checklist items from the database  **
  // Returns:
  // - checkList: Object containing all retrieved checklist item data
  async function getCheckItemsFromDB() {
    let checkList = {};
    const apiHelper = new ApiHelper(baseUrl);
    try {
      const response = await apiHelper.get('/todo-items');
      console.log('Checklist items retrieved successfully:', response);
  
      if (response) {
        checkList = response;
      }
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
  
    return checkList;
  }
  
  // ** Retrieves all time track items from the database  **
  // Returns:
  // - timeTracks: Object containing all retrieved time tracker item data
  async function getTimeTrackFromDB() {
    let timeTracks = {};
    const apiHelper = new ApiHelper(baseUrl);
  
    try {
      const response = await apiHelper.get('/time-tracker-items');
      console.log('Time tracker items retrieved successfully:', response);
  
      if (response) {
        timeTracks = response;
      }
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
  
    return timeTracks;
  }
  
  // ** Retrieves all events from the database  **
  // Returns:
  // - events: Object containing all retrieved event data
  async function getEventsFromDB() {
    let events = {};
    try {
      const apiHelper = new ApiHelper(baseUrl);
      const response = await apiHelper.get('/appointments');
      console.log('Events retrieved successfully:', response);
  
      if (response) {
        events = response;
      }
    } catch (error) {
      console.error('Error performing CRUD operation:', error);
    }
    return events;
  }

  function markItemDeleted(item)
  {
    console.log(item);
    let typeSubStr = item.substring(0,3);
    let idVal = item.substring(3);
    console.log(typeSubStr);
    switch (typeSubStr) {
        case "not":
            markNoteDeleted(idVal);
            break;
        case "chk":
            markCheckItemDeleted(idVal);
            break;
        case "tim":
            markTimeTrackDeleted(idVal);
            break;
        case "evt":
            markEventDeleted(idVal);
            break;
        default:
            break;
    }
  }