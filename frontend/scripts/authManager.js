import { backendUrl } from './apiConfig.js';

function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    window.location.href = "/index.html";
}

async function isTokenValid(token) {
    if (!token) return false;

    try {
        let response = await fetch(`${backendUrl}/api/v1/validate-token`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }
        });

        if (response.ok) {
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('Error verifying token');
        return false;
    }
}

export { logout, isTokenValid };