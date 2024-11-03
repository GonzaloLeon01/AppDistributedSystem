import HomePage from "./pages/HomePage.js";
import AnimalLocationPage from "./pages/AnimalLocationPage.js";
import AnimalManagementPage from "./pages/AnimalManagementPage.js";
import CheckpointManagementPage from "./pages/CheckpointManagementPage.js";
import LoginPage from "./pages/LoginPage.js";
import NotFoundPage from "./pages/NotFoundPage.js";
import AuthStateHelper from "./helper/state/AuthStateHelper.js";
import AuthLayout from "./components/layouts/AuthLayout.js";
import LoggedInLayout from "./components/layouts/LoggedInLayout.js";
import "./helper/api/AxiosRequestInterceptor.js";

export const navigateTo = (url) => {
  history.pushState({}, "", url);
  loadPage();
};

const route = (event) => {
  event = event || window.event;
  event.preventDefault();
  const isAuth = !!AuthStateHelper.getAccessToken();
  if (!isAuth && event.target.href !== "/login") {
    navigateTo("/login");
  } else {
    navigateTo(event.target.href);
  }
};

function loadLayout() {
  const isAuth = !!AuthStateHelper.getAccessToken();
  if (isAuth) {
    new LoggedInLayout("container");
  } else {
    new AuthLayout("container");
  }
}

function loadPage() {
  loadLayout();
  const isAuth = !!AuthStateHelper.getAccessToken();

  if (!isAuth) {
    history.pushState({}, "", "/login");
    return new LoginPage("layout-content");
  }

  // Cargar diferentes páginas según la ruta
  switch (location.pathname) {
    case "/":
      new HomePage("layout-content");
      break;
    case "/animals/location":
      new AnimalLocationPage("layout-content");
      break;
    case "/animals/manage":
      new AnimalManagementPage("layout-content");
      break;
    case "/checkpoints/manage":
      new CheckpointManagementPage("layout-content");
      break;
    case "/login":
      new LoginPage("layout-content");
      break;
    default:
      new NotFoundPage("layout-content");
      break;
  }
}

window.route = route;
window.onpopstate = loadPage;

document.addEventListener("DOMContentLoaded", () => {
  document.body.addEventListener("click", (e) => {
    if (e.target.matches("[data-link]")) {
      e.preventDefault();
      navigateTo(e.target.href);
    }
  });
  loadPage();
});
