import axios from "axios";

const API_URL = "/API/login"; // Cambia esto por la URL de tu API

export default class AuthAPIHelper {
  static async login(credentials) {
    const response = await axios.post(API_URL, credentials);
    return response.data; // devuelve accessToken, refreshToken, etc.
  }

  static async refreshToken() {
    const response = await axios.post("/API/refresh");
    return response.data; // devuelve nuevo accessToken
  }
}
