import { backendUrl, cognitoDomain, clientId, logoutRedirectUri } from './apiConfig.js';

function logout() {
    const authUrl = `https://${cognitoDomain}/logout?client_id=${clientId}&logout_uri=${logoutRedirectUri}`;
    document.getElementById('login').classList.add('hide');
    window.location.href = authUrl;
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