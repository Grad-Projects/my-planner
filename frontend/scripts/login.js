import { isTokenValid } from "./authManager";

if (isTokenValid()) {
  window.location.href = '/index.html';
}

const hostname = window.location.hostname;
const clientId = '4k2e6jc066p8jsb6b86e90mm7j';
const cognitoDomain = 'my-planner.auth.eu-west-1.amazoncognito.com';
let backendUrl = 'https://myplannerapi.projects.bbdgrad.com';
let redirectUri = 'https://myplanner.projects.bbdgrad.com/callback.html';
if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
  backendUrl = 'http://localhost:8080';
  redirectUri = 'http://localhost:5500/callback.html';
}

// Helper function to generate a random string of specified length
function generateRandomString(length) {
  const array = new Uint8Array(length);
  window.crypto.getRandomValues(array);
  return Array.from(array, byte => ('0' + byte.toString(36)).slice(-2)).join('');
}

// Helper function to base64 URL encode an ArrayBuffer
function base64UrlEncode(arrayBuffer) {
  const base64 = btoa(String.fromCharCode.apply(null, new Uint8Array(arrayBuffer)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function generateCodeVerifierAndChallenge() {
  const codeVerifier = generateRandomString(64);

  // Hash the code verifier using SHA-256
  const hashed = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));

  // Base64-urlencode the hash
  const codeChallenge = base64UrlEncode(hashed);

  return { codeVerifier, codeChallenge };
}

document.getElementById('loginBtn').addEventListener('click', async () => {
  const { codeVerifier, codeChallenge } = await generateCodeVerifierAndChallenge();
  const state = generateRandomString(16);
  console.log(state);

  // Store in DB
  let response = await fetch('http://localhost:8080/api/v1/create/oauth-state', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      state: state, 
      code_verifier: codeVerifier 
    })
  });

  if (response.ok) {
    // Redirect to cognito authentication
    const authUrl = `https://${cognitoDomain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid+email+profile+aws.cognito.signin.user.admin&code_challenge_method=S256&code_challenge=${codeChallenge}&state=${state}`;
    console.log(authUrl);
    window.location.href = authUrl;
  }
  else {
    console.error('Failed to store state and code verifier');
  }
});