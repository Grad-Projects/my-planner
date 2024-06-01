window.deleteNoteItem = deleteNoteItem;
window.deleteCheckItem = deleteCheckItem;
window.deleteTimeItem = deleteTimeItem;

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