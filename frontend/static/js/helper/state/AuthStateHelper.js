/* Este archivo manejará el estado de autenticación, como almacenar el token de acceso y el token de actualización, así como recuperar y eliminar estos tokens. */

const AUTH_KEY = "auth";

class AuthStateHelper {
  static setAuth(authData) {
    localStorage.setItem(AUTH_KEY, JSON.stringify(authData));
  }

  static getAccessToken() {
    const auth = localStorage.getItem(AUTH_KEY);
    return auth ? JSON.parse(auth).accessToken : null;
  }

  static setRefreshToken(token) {
    const auth = JSON.parse(localStorage.getItem(AUTH_KEY));
    if (auth) {
      auth.refreshToken = token;
      localStorage.setItem(AUTH_KEY, JSON.stringify(auth));
    }
  }

  static deleteAuth() {
    localStorage.removeItem(AUTH_KEY);
  }
}

export default AuthStateHelper;
