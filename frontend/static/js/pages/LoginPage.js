/* Esta página maneja el proceso de inicio de sesión del usuario en la aplicación. */

/* Esta página maneja el proceso de inicio de sesión del usuario en la aplicación. */

import { navigateTo } from "../index.js";
import AuthAPIHelper from "../helper/api/AuthAPIHelper.js";
import { validateLogin } from "../helper/validations/authValidations.js";
import UserStateHelper from "../helper/state/UserStateHelper.js";
import AuthStateHelper from "../helper/state/AuthStateHelper.js";

export default class LoginPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadForm();
  }

  async loadForm() {
    this.render(); // Renderiza el formulario de inicio de sesión
    this.addListener(); // Agrega el listener para el evento de envío
  }

  async handleSubmit(event) {
    try {
      event.preventDefault(); // Previene la acción predeterminada del formulario
      const username = event.target.elements.username.value.trim(); // Obtiene el nombre de usuario
      const password = event.target.elements.password.value.trim(); // Obtiene la contraseña
      validateLogin({ username, password }); // Valida los datos ingresados
      const userData = await AuthAPIHelper.login({ username, password }); // Llama a la API para iniciar sesión
      const { accessToken, refreshToken, ...rest } = userData; // Desestructura los datos del usuario
      UserStateHelper.setUser(rest); // Almacena la información del usuario
      AuthStateHelper.setAuth({ accessToken, refreshToken }); // Almacena el estado de autenticación
      navigateTo("/"); // Redirige a la página principal
      window.removeEventListener("submit", this.handleSubmit); // Remueve el listener del evento de envío
    } catch (e) {
      alert("Usuario o contraseña incorrectos"); // Muestra un mensaje de error
    }
  }

  addListener() {
    window.addEventListener("submit", this.handleSubmit.bind(this)); // Agrega el listener para el envío del formulario
  }

  render() {
    const formHtml = `
      <form id="login-form" class="login-form-container">
        <h2 class="login-form-title">Iniciar sesión</h2>
        <div class="input-container">
          <label for="username" class="input-label">Usuario:</label>
          <input type="text" id="username" name="username" class="input-field" required>
        </div>
        <div class="input-container">
          <label for="password" class="input-label">Contraseña:</label>
          <input type="password" id="password" name="password" class="input-field" required>
        </div>
        <button type="submit" class="form-submit-button">Iniciar sesión</button>
      </form>
    `;
    this.container.innerHTML = formHtml; // Inserta el HTML del formulario en el contenedor
  }
}
