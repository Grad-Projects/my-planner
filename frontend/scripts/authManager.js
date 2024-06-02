function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("email");
    window.location.href = "/pages/login.html";
}

function base64UrlDecode(input) { 
  let base64String = input.replace(/-/g, '+').replace(/_/g, '/');
  let padding = 4 - (base64String.length % 4);
  if (padding !== 4) {
      for (let i = 0; i < padding; i++) {
          base64String += '=';
      }
  }
  const decodedData = atob(base64String);
  const decodedString = decodeURIComponent(Array.from(decodedData).map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));
  return decodedString;
}

function decodeJWT(token = localStorage.getItem('jwtToken')) {
  try {
      const data = token.split('.')[1];
      const stringify = (base64UrlDecode(data));
      return JSON.parse(stringify);
  } catch (error) {
      console.error(error)
      return null;
  }
}

function isTokenValid() {
    const token = localStorage.getItem("accessToken");
    if (!token) return false;
    const payload = decodeJWT(token)
    return !(!payload || Date.now() >= (payload.exp * 1000) - 30000);
}

export { logout, isTokenValid };