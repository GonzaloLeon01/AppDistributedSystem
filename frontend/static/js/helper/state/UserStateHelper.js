/* Este archivo puede encargarse de almacenar y recuperar información sobre el usuario autenticado, como su nombre, ID y cualquier otro dato relevante. También puede incluir funciones para eliminar el estado del usuario al cerrar sesión. */

const USER_KEY = "user";

class UserStateHelper {
  static setUser(userData) {
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
  }

  static getUser() {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static deleteUser() {
    localStorage.removeItem(USER_KEY);
  }
}

export default UserStateHelper;
