import { isTokenValid, logout } from "./authManager.js";

console.log(localStorage.getItem('accessToken'));

if (!isTokenValid()) {
    console.log(localStorage.getItem('accessToken'));
    logout();
}

document.getElementById('emailAddress').textContent = localStorage.getItem('email');
document.querySelector('.logoutButton').addEventListener('click', logout);