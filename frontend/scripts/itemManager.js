window.deleteNoteItem = deleteNoteItem;
window.deleteCheckItem = deleteCheckItem;
window.deleteTimeItem = deleteTimeItem;
window.popUpCreateNote = popUpCreateNote;
window.addNoteItem = addNoteItem;
window.cancelAddNote = cancelAddNote;
window.addCheckItem = addCheckItem;
window.popUpCreateCheckListItem = popUpCreateCheckListItem;
window.changeIcon = changeIcon;

let noteList = document.getElementById("noteList");
let overlay = document.getElementById("overlay");
let notePopUp = document.getElementById("notePopUp");
let checkListPopUp = document.getElementById("checkListPopUp")
let checkList = document.getElementById("checkList");

let noteTitleInput = document.getElementById("noteTitle");
let noteContentInput = document.getElementById("noteContent");
let checkListContent = document.getElementById("checkListDesc");

function cancelAddNote(){
    overlay.classList.add("hide");
    notePopUp.classList.add("hide");
    checkListPopUp.classList.add("hide");
}

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

function popUpCreateCheckListItem(){
    overlay.classList.remove("hide");
    checkListPopUp.classList.remove("hide");

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
