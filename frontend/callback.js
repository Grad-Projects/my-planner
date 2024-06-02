const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const code = urlParams.get('code');
const state = urlParams.get('state');
const cognitoDomain = 'my-planner.auth.eu-west-1.amazoncognito.com';
const clientId = '4k2e6jc066p8jsb6b86e90mm7j';
const redirectUri = 'http://localhost:5500/frontend/callback.html';

if (code && state) {
  // Get saved code verifier and state
  const savedCodeVerifier = sessionStorage.getItem('codeVerifier');
  // const savedCodeVerifier = "renut754nT8fc14ugCU6bqideJVWf0rdnmkoReIc1iW9AGPaLtXS4aHNYfzy8hWD"
  const savedState = sessionStorage.getItem('state');
  // const savedState = "ByZYt1EVIyA01HeS";
  console.log(savedState);

  if (state === savedState) {
    // Perform token exchange with code and code verifier
    exchangeAuthorizationCodeForTokens(code, savedCodeVerifier);
    // window.location.href = "/frontend/index.html"
  } else {
    console.error('State mismatch. Possible CSRF attack.');
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
    debugger;
    const response = await fetch(tokenEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: body
    });
    console.log(response);

    const tokens = await response.json();
    console.log(tokens); // Handle tokens as needed
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('idToken', tokens.id_token);
    localStorage.setItem('refreshToken', tokens.refresh_token);
  } catch (error) {
    console.error('Token exchange failed:', error);
  }
}