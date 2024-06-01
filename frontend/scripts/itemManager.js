window.deleteNoteItem = deleteNoteItem;
window.deleteCheckItem = deleteCheckItem;
window.deleteTimeItem = deleteTimeItem;
window.popUpCreateNote = popUpCreateNote;
window.addNoteItem = addNoteItem;

let noteList = document.getElementById("noteList");
let overlay = document.getElementById("overlay");
let notePopUp = document.getElementById("notePopUp");

let noteTitleInput = document.getElementById("noteTitle");
let noteContentInput = document.getElementById("noteContent");

function deleteNoteItem(event){
    const item = event.target;
    const parent1 = item.parentElement;
    parent1.remove();
}

function deleteTimeItem(event){
    const item = event.target;
    const parent1 = item.parentElement;
    parent1.remove();
}

function deleteCheckItem(event){
    const item = event.target;
    const parent1 = item.parentElement;
    const parent2 = parent1.parentElement;
    parent2.remove();
}

function popUpCreateNote(){
    overlay.classList.remove("hide");
    notePopUp.classList.remove("hide");
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

