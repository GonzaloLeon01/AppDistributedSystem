import UserStateHelper from "../../helper/state/UserStateHelper.js";
import AuthStateHelper from "../../helper/state/AuthStateHelper.js";
import { navigateTo } from "../../index.js";

window.logout = () => {
  AuthStateHelper.deleteAuth();
  UserStateHelper.deleteUser();
  navigateTo("/login");
};

export default class LoggedInLayout {
  constructor(selector) {
    const userData = UserStateHelper.getUser();
    this.container = document.getElementById(selector);
    this.userName = userData.name || "Usuario"; // Asegúrate de tener un nombre de usuario por defecto.
    this.render();
  }

  render() {
    const layoutHtml = `
            <header class="auth-layout-header">
                <h1>Sistema de Monitoreo de Ganado</h1>
                <p>Hola, ${this.userName}</p>
                <nav class="header-nav">
                    <ul>
                        <li><a href="/home">Inicio</a></li>
                        <li><a href="/animals">Gestión de Animales</a></li>
                        <li><a href="/checkpoints">Gestión de Puntos de Control</a></li>
                        <li><a href="#" onclick="logout()">Cerrar sesión</a></li>
                    </ul>
                </nav>
            </header>
            <div class="loggedin-layout-content-container">
                <div id="layout-content"></div>
            </div>
        `;
    this.container.innerHTML = layoutHtml;
  }
}
