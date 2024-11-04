import UserStateHelper from "../../helper/state/UserStateHelper.js";
import AuthStateHelper from "../../helper/state/AuthStateHelper.js";
import { navigateTo } from "../../index.js";

window.logout = () => {
    AuthStateHelper.deleteAuth();
    UserStateHelper.deleteUser();
    navigateTo('/login')
};

export default class LoggedInLayout {
    constructor(selector) {
        const userData = UserStateHelper.getUser();
        this.container = document.getElementById(selector);
        this.userName = userData.name;
        this.render();
    }

    render() {
        const layoutHtml = `
            <header class="auth-layout-header">
                <h1>Games Frontend</h1>
                <p>Hola ${this.userName}</p>
                <nav class="header-nav">
                    <ul>
                        <li><a href="/">Listado</a></li>
                        <li><a href="/add">Crear juego</a></li>
                        <li><a href="#" onclick="logout()">Cerrar sesion</a></li>
                    </ul>
                </nav>
            </header>
            <div class="loggedin-layout-content-container">
                <div id="layout-content">
                </div>
            </div>
        `;
        this.container.innerHTML = layoutHtml;
    }
}