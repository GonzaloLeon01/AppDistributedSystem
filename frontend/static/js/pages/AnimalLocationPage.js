/* Página para visualizar la ubicación de los animales */

import AnimalsAPIHelper from "../helper/api/AnimalsAPIHelper.js";

export default class AnimalLocationPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadAnimalLocations();
  }

  async loadAnimalLocations() {
    try {
      const data = await AnimalsAPIHelper.getAnimalsPosition();
      console.log(data);

      /* // Mock data para la respuesta de animals/position
      const data = [
        {
          id: "pos-001",
          lat: -34.603722,
          long: -58.381592,
          description: "Establo Principal",
          animals: [
            {
              id: "11:5e:e7:84:c4:f6", // ID único del animal
              name: "Roberto Carlos", // Nombre del animal
              description: "No es una vaca👀", // Descripción del animal
            },
            // Más objetos de animales con la misma estructura pueden seguir aquí
          ],
        },
        {
          id: "pos-002",
          lat: -34.610768,
          long: -58.382452,
          description: "Campo de Pastoreo Norte",
          animals: [
            {
              id: "11:5e:e7:84:c4:f6", // ID único del animal
              name: "Roberto Carlos", // Nombre del animal
              description: "No es una vaca👀", // Descripción del animal
            },
            // Más objetos de animales con la misma estructura pueden seguir aquí
          ],
        },
        {
          id: "pos-003",
          lat: -34.608301,
          long: -58.387305,
          description: "Río Este",
          animals: [
            {
              id: "11:5e:e7:84:c4:f6", // ID único del animal
              name: "Roberto Carlos", // Nombre del animal
              description: "No es una vaca👀", // Descripción del animal
            },
            // Más objetos de animales con la misma estructura pueden seguir aquí
          ],
        },
        {
          id: "pos-004",
          lat: -34.60405,
          long: -58.3881,
          description: "Descanso Sur",
          animals: [
            {
              id: "11:5e:e7:84:c4:f6", // ID único del animal
              name: "Roberto Carlos", // Nombre del animal
              description: "No es una vaca👀", // Descripción del animal
            },
            {
              id: "112:5e:e7:84:c4:f6", // ID único del animal
              name: "Roberto2 Carlos", // Nombre del animal
              description: "No es una vaca👀", // Descripción del animal
            },
            // Más objetos de animales con la misma estructura pueden seguir aquí
          ],
        },
      ]; */

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
        <p><strong>Descripción:</strong> ${location.description}</p>
        <p><strong>Latitud:</strong> ${location.lat}</p>
        <p><strong>Longitud:</strong> ${location.long}</p>
        ${
          location.animals && location.animals.length > 0
            ? `
              <p><strong>Animales asociados:</strong></p>
              <ul>
                ${location.animals
                  .map(
                    (animal) => `
                      <li>
                        <p><strong>MAC:</strong> ${animal.id}</p>
                        <p><strong>Nombre:</strong> ${animal.name}</p>
                        <p><strong>Descripción:</strong> ${animal.description}</p>
                      </li>
                    `
                  )
                  .join("")}
              </ul>
            `
            : "<p><strong>Animales asociados:</strong> No hay animales asociados</p>"
        }
      </div>
    `;
  }
}
