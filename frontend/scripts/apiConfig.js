const hostname = window.location.hostname;
const clientId = '4k2e6jc066p8jsb6b86e90mm7j';
const cognitoDomain = 'my-planner.auth.eu-west-1.amazoncognito.com';
let backendUrl = 'https://myplannerapi.projects.bbdgrad.com';
let redirectUri = 'https://myplanner.projects.bbdgrad.com/callback.html';
if (hostname.includes("localhost") || hostname.includes("127.0.0.1")) {
  backendUrl = 'https://localhost:8080';
  redirectUri = 'https://localhost:5500/callback.html';
}

export { backendUrl, redirectUri, clientId, cognitoDomain };