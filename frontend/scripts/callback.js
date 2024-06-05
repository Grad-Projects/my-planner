import { clientId, cognitoDomain, backendUrl, redirectUri } from './apiConfig.js';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const code = urlParams.get('code');
const state = urlParams.get('state');
let email;

if (code && state) {
  // Retrieve code verifier from DB
  let response = await fetch(`${backendUrl}/api/v1/oauth-state?state=${state}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.ok) {
    const data = await response.json();
    const savedCodeVerifier = data.code_verifier;
    await exchangeAuthorizationCodeForTokens(code, savedCodeVerifier);
    await createUser();
    window.location.href = "/index.html"
  }
  else {
    console.error('Failed to retrieve state and code verifier');
    window.location.href = "/index.html"
  }
}

 // Function to exchange authorization code for tokens
 async function exchangeAuthorizationCodeForTokens(code, codeVerifier) {
  const tokenEndpoint = `https://${cognitoDomain}/oauth2/token`;
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: clientId,
    code_verifier: codeVerifier,
    code: code,
    redirect_uri: redirectUri
  });

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    });

    const tokens = await response.json();
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('idToken', tokens.id_token);
    localStorage.setItem('refreshToken', tokens.refresh_token);
  } catch (error) {
    console.error('Token exchange failed:', error);
  }
}

async function createUser() {
  const response = await fetch(`${backendUrl}/api/v1/create/user`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
  });
  if (response.ok) {
    const data = await response.json();
    email = data.email;
    localStorage.setItem('email', email);
  }else {
    console.error('Failed to create user');
  }
}