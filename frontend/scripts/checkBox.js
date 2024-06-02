window.changeIcon = changeIcon;

function changeIcon(event){
    const item = event.target;
    if(item.innerText == "radio_button_unchecked"){
        item.innerText = "check_circle";
    }else{
        item.innerText = "radio_button_unchecked";
    }
}