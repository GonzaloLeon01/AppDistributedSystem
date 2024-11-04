import AnimalLocationPage from "./pages/AnimalLocationPage.js";
import AnimalManagementPage from "./pages/AnimalManagementPage.js";
import CheckpointManagementPage from "./pages/CheckpointManagementPage.js";
import LoginPage from "./pages/LoginPage.js";
import NotFoundPage from "./pages/NotFoundPage.js";
import Header from "./components/layouts/Header.js";


import AuthStateHelper from "./helper/state/AuthStateHelper.js";

//Funcion para navegar entre paginas
export const navigateTo = (url) => {
  history.pushState({}, "", url);
  console.log(url);
  loadPage();
};
const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  const isAuth = !!AuthStateHelper.getAccessToken();
  if (!isAuth && event.target.href !== '/login') {
      navigateTo('/login');
  } else {
      navigateTo(event.target.href);
  }
}

function loadLayout() {
  const isAuth = !!AuthStateHelper.getAccessToken();
  if (isAuth) {
      //new LoggedInLayout("container");
      new Header("header-container");
      return;
  }
  //new AuthLayout("container");
}
//Funcion para manejar el enrutamiento y carga de la pagina
function loadPage() {
  loadLayout();
  const isAuth = !!AuthStateHelper.getAccessToken();
  if (!isAuth) {
      history.pushState({}, "", "/login");
      return new LoginPage('layout-content');
  }
  // Cargar el header en el contenedor principal
  //new Header("header-container");
  // Cargar la página según la ruta
  const path = location.pathname;
  if (path === "/") {
    new AnimalLocationPage("layout-content");
  } else if (path === "/add-animal") {
    new AnimalManagementPage("layout-content");
  } else if (path === "/add-checkpoint") {
    new CheckpointManagementPage("layout-content");
  } else if (location.pathname === '/login') {
    new LoginPage('layout-content');
  } else {
    new NotFoundPage("layout-content");
  }
}
// Cargar la página correspondiente en eventos de navegación del historial
window.route = route;
window.onpopstate = loadPage;
// Manejador para enlaces de navegación
document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });

  // Cargar la primera página
  loadPage();
});


