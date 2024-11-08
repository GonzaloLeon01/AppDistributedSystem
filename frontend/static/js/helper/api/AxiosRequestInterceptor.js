import AuthStateHelper from "../state/AuthStateHelper.js";

axios.interceptors.request.use(function (config) {

    const token = AuthStateHelper.getAccessToken();
    const expirationTime = AuthStateHelper.getExpiryTime(); // Asumiendo que tienes esta función
    
    const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
    const timeLeft = expirationTime - currentTime;

    if (timeLeft < 60) { // Menos de un minuto para expirar
        try {
            refreshToken(); // Refresca el token
        } catch (error) {
            console.error("Error al refrescar el token:", error);
            throw error; // Puedes manejar el error según tu lógica
        }
    }

    const newToken = AuthStateHelper.getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

async function refreshToken() {
    try {
      const refreshToken = AuthStateHelper.getRefreshToken();
      const response = await axios.post("http://localhost:4000/API/refresh", {
        refreshToken,
      });
  
      const { accessToken } = response.data;
      if (accessToken) {
        AuthStateHelper.setAuth({ ...AuthStateHelper.getAuth(), accessToken });
        console.log("Token renovado correctamente");
      } else {
        throw new Error("Error al renovar el token");
      }
    } catch (error) {
      console.error("No se pudo renovar el token", error);
      
      // Opcional: redirige al usuario a la página de inicio de sesión si no es posible renovar el token
      AuthStateHelper.deleteAuth();
      navigateTo("/login");
    }
  }