const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const code = urlParams.get('code');
const state = urlParams.get('state');
const cognitoDomain = 'my-planner.auth.eu-west-1.amazoncognito.com';
const clientId = '4k2e6jc066p8jsb6b86e90mm7j';
const redirectUri = 'http://localhost:5500/frontend/callback.html';

if (code && state) {
  // Get saved code verifier and state
  let response = await fetch(`http://localhost:8080/api/v1/oauth-state?state=${state}`, {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' }
  });

  if (response.ok) {
    const data = await response.json();
    const savedCodeVerifier = data.code_verifier;
    await exchangeAuthorizationCodeForTokens(code, savedCodeVerifier);
    await createUser();
    window.location.href = "/frontend/index.html"
  }
  else {
    console.error('Failed to retrieve state and code verifier');
    window.location.href = "/frontend/index.html"
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
  console.log(`Body: ${body}`)

  try {
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    });
    console.log(response);

    const tokens = await response.json();
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('idToken', tokens.id_token);
    localStorage.setItem('refreshToken', tokens.refresh_token);
  } catch (error) {
    console.error('Token exchange failed:', error);
  }
}

async function createUser() {
  const response = await fetch('http://localhost:8080/api/v1/create/user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
  });
  if (!response.ok) {
    console.error('Failed to create user');
  }
}