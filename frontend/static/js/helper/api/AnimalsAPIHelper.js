import axios from "axios";

const API_URL = "/API/animals"; // Cambia esto por la URL de tu API

export default class AnimalsAPIHelper {
  static async getAnimals() {
    const response = await axios.get(API_URL);
    return response.data.animals; // devuelve la lista de animales
  }

  static async addAnimal(animalData) {
    const response = await axios.post(API_URL, animalData);
    return response.data; // devuelve el animal creado
  }

  static async updateAnimal(id, animalData) {
    const response = await axios.patch(`${API_URL}/${id}`, animalData);
    return response.data; // devuelve el animal actualizado
  }

  static async deleteAnimal(id) {
    await axios.delete(`${API_URL}/${id}`);
  }

  static async getAnimalsPosition() {
    const response = await axios.get(`${API_URL}/position`);
    return response.data; // devuelve la lista de posiciones de animales
  }
}
