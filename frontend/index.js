const clientId = '4k2e6jc066p8jsb6b86e90mm7j';
const cognitoDomain = 'my-planner.auth.eu-west-1.amazoncognito.com';
const redirectUri = 'http://localhost:5500/frontend/callback.html'; // Your frontend callback URI

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
  // const codeVerifier = generateRandomString(64);
  const codeVerifier = "renut754nT8fc14ugCU6bqideJVWf0rdnmkoReIc1iW9AGPaLtXS4aHNYfzy8hWd";

  // Hash the code verifier using SHA-256
  const hashed = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier));

  // Base64-urlencode the hash
  const codeChallenge = base64UrlEncode(hashed);

  return { codeVerifier, codeChallenge };
}

document.getElementById('loginBtn').addEventListener('click', async () => {
  const { codeVerifier, codeChallenge } = await generateCodeVerifierAndChallenge();
  // const state = generateRandomString(16);
  const state = "ByZYt1EVIyA01Hes";
  console.log(state);

  sessionStorage.setItem('codeVerifier', codeVerifier);
  sessionStorage.setItem('codeChallenge', codeChallenge);
  sessionStorage.setItem('state', state);

  const authUrl = `https://${cognitoDomain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid+email+profile&code_challenge_method=S256&code_challenge=${codeChallenge}&state=${state}`;
  console.log(authUrl);
  window.location.href = authUrl;
});