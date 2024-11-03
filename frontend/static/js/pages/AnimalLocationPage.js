/* Página para visualizar la ubicación de los animales */

// AnimalLocationPage.js

import AnimalsAPIHelper from "../helper/api/AnimalsAPIHelper.js";

export default class AnimalLocationPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadAnimalLocations();
  }

  async loadAnimalLocations() {
    try {
      const data = await AnimalsAPIHelper.getAnimalLocations();
      this.animalLocations = data;
    } catch (error) {
      console.error("Error loading animal locations:", error);
      this.animalLocations = [];
    } finally {
      this.render();
    }
  }

  render() {
    const locationHtml = `
      <h2 class="animal-location-title">Ubicaciones de Animales</h2>
      <div class="animal-location-list">
        ${this.animalLocations
          .map((location) => this.renderLocationItem(location))
          .join("")}
      </div>
    `;
    this.container.innerHTML = locationHtml;
  }

  renderLocationItem(location) {
    return `
      <div class="animal-location-item">
        <h3>${location.id}</h3>
        <p><strong>Nombre:</strong> ${location.name}</p>
        <p><strong>Descripción:</strong> ${location.description}</p>
        <p><strong>Latitud:</strong> ${location.lat}</p>
        <p><strong>Longitud:</strong> ${location.long}</p>
        ${
          location.animals && location.animals.length > 0
            ? `<p><strong>Animales asociados:</strong> ${location.animals.join(
                ", "
              )}</p>`
            : ""
        }
      </div>
    `;
  }
}
