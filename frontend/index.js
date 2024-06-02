const clientId = '4k2e6jc066p8jsb6b86e90mm7j';
const cognitoDomain = 'my-planner.auth.eu-west-1.amazoncognito.com';
const redirectUri = 'http://localhost:5500/frontend/callback.html'; // Your frontend callback URI

function generateRandomString(length) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

function generateCodeVerifierAndChallenge() {
  const codeVerifier = generateRandomString(64);
  // const codeVerifier = "renut754nT8fc14ugCU6bqideJVWf0rdnmkoReIc1iW9AGPaLtXS4aHNYfzy8hWD";
  const codeChallenge = btoa(crypto.subtle.digest('SHA-256', new TextEncoder().encode(codeVerifier)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  return { codeVerifier, codeChallenge };
}

function base64URLEncode(buffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

document.getElementById('loginBtn').addEventListener('click', () => {
  const { codeVerifier, codeChallenge } = generateCodeVerifierAndChallenge();
  const state = generateRandomString(16);
  // const state = "ByZYt1EVIyA01HeS";
  console.log(state);

  sessionStorage.setItem('codeVerifier', codeVerifier);
  sessionStorage.setItem('codeChallenge', codeChallenge);
  sessionStorage.setItem('state', state);

  const authUrl = `https://${cognitoDomain}/oauth2/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=openid+email+profile&code_challenge_method=S256&code_challenge=${codeChallenge}&state=${state}`;
  console.log(authUrl);
  window.location.href = authUrl;
});