/*  Página para gestionar animales, incluyendo añadir, editar y eliminar animales */

// AnimalManagementPage.js

import AnimalItem from "../components/AnimalItem.js";
import AnimalsAPIHelper from "../helper/api/AnimalsAPIHelper.js";

export default class AnimalManagementPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadAnimals();
  }

  async loadAnimals() {
    try {
      const data = await AnimalsAPIHelper.getAnimals();
      this.animals = data.animals;
    } catch (error) {
      console.error("Error loading animals:", error);
      this.animals = [];
    } finally {
      this.render();
      this.addListeners();
    }
  }

  async handleAddAnimal(event) {
    event.preventDefault();
    const id = event.target.elements.id.value.trim();
    const name = event.target.elements.name.value.trim();
    const description = event.target.elements.description.value.trim();

    try {
      await AnimalsAPIHelper.addAnimal({ id, name, description });
      alert("Animal añadido con éxito");
      this.loadAnimals();
    } catch (error) {
      console.error("Error adding animal:", error);
      alert("Error al añadir el animal");
    }
  }

  async handleEditAnimal(id) {
    const name = prompt("Nuevo nombre del animal:");
    const description = prompt("Nueva descripción del animal:");

    if (name && description) {
      try {
        await AnimalsAPIHelper.updateAnimal(id, { name, description });
        alert("Animal actualizado con éxito");
        this.loadAnimals();
      } catch (error) {
        console.error("Error updating animal:", error);
        alert("Error al actualizar el animal");
      }
    }
  }

  async handleDeleteAnimal(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este animal?")) {
      try {
        await AnimalsAPIHelper.deleteAnimal(id);
        alert("Animal eliminado con éxito");
        this.loadAnimals();
      } catch (error) {
        console.error("Error deleting animal:", error);
        alert("Error al eliminar el animal");
      }
    }
  }

  render() {
    const formHtml = `
      <form id="animal-form" class="animal-form-container">
        <h2 class="animal-form-title">Añadir nuevo animal</h2>
        <div class="input-container">
          <label for="id" class="input-label">ID:</label>
          <input type="text" id="id" name="id" class="input-field" required>
        </div>
        <div class="input-container">
          <label for="name" class="input-label">Nombre:</label>
          <input type="text" id="name" name="name" class="input-field" required>
        </div>
        <div class="input-container">
          <label for="description" class="input-label">Descripción:</label>
          <input type="text" id="description" name="description" class="input-field" required>
        </div>
        <button type="submit" class="form-submit-button">Añadir Animal</button>
      </form>
      <div class="animal-list">
        <h3 class="animal-list-title">Lista de Animales</h3>
        ${this.animals
          .map((animal) => new AnimalItem(animal).render())
          .join("")}
      </div>
    `;
    this.container.innerHTML = formHtml;
  }

  addListeners() {
    document
      .getElementById("animal-form")
      .addEventListener("submit", (e) => this.handleAddAnimal(e));

    // Adding edit and delete listeners for each animal
    this.animals.forEach((animal) => {
      document
        .getElementById(`edit-${animal.id}`)
        .addEventListener("click", () => this.handleEditAnimal(animal.id));
      document
        .getElementById(`delete-${animal.id}`)
        .addEventListener("click", () => this.handleDeleteAnimal(animal.id));
    });
  }
}
