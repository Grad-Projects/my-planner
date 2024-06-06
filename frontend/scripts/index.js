import { isTokenValid, logout } from "./authManager.js";

const accessToken = localStorage.getItem('accessToken');
let loggedIn = false;

if (!accessToken) {
    document.getElementById('login').classList.remove('hide');
}
else if (!isTokenValid(accessToken)) {
    logout();
} else {
    loggedIn = true;

    document.getElementById('emailAddress').textContent = localStorage.getItem('email');
    document.querySelector('.logoutButton').addEventListener('click', logout);
    document.getElementById('login').classList.add('hide');

    // Unhide the main content
    document.querySelector('.header').classList.remove('hide');
    document.getElementById('weekListView').classList.remove('hide');
    document.querySelector('.plannerCards').classList.remove('hide');
}

export { loggedIn };