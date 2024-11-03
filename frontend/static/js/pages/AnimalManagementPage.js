/*  Página para gestionar animales, incluyendo añadir, editar y eliminar animales */
import AnimalItem from "../components/AnimalItem.js";
import AnimalsAPIHelper from "../helper/api/AnimalsAPIHelper.js";
import { navigateTo } from "../index.js";

export default class AnimalManagementPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadAnimals();
  }

  async loadAnimals() {
    try {
      //const data = await AnimalsAPIHelper.getAnimals();
      const data = [
        {
          id: "BT-0012345678",
          name: "Bessie",
          description: "Una vaca lechera holandesa con buen temperamento.",
        },
        {
          id: "BT-0098765432",
          name: "Bella",
          description: "Vaca Jersey conocida por su alta producción de leche.",
        },
        {
          id: "BT-0021354689",
          name: "Max",
          description: "Un toro Hereford fuerte y robusto.",
        },
        {
          id: "BT-0054891324",
          name: "Luna",
          description: "Ternera Simmental curiosa y juguetona.",
        },
        {
          id: "BT-0045687321",
          name: "Rocky",
          description: "Un buey Angus musculoso y confiable.",
        },
        {
          id: "BT-0076543210",
          name: "Daisy",
          description: "Vaca Charolais amigable con excelente genética.",
        },
      ];
      this.animals = data;
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
      //await AnimalsAPIHelper.addAnimal({ id, name, description });
      this.animals.push({ id, name, description });
      alert("Animal añadido con éxito");
      //this.loadAnimals(); // esto si va
      this.render(); // esto no va
      this.addListeners(); // esto no va, es lo que hace que tire error
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
        //await AnimalsAPIHelper.updateAnimal(id, { name, description });
        alert("Animal actualizado con éxito");
        //this.loadAnimals();

        const index = this.animals.findIndex((animal) => animal.id === id);
        if (index !== -1) {
          this.animals[index].name = name;
          this.animals[index].description = description;
        }
        alert("Animal actualizado con éxito");
        this.render();
        this.addListeners();
      } catch (error) {
        console.error("Error updating animal:", error);
        alert("Error al actualizar el animal");
      }
    }
  }

  async handleDeleteAnimal(id) {
    if (confirm("¿Estás seguro de que deseas eliminar este animal?")) {
      try {
        //await AnimalsAPIHelper.deleteAnimal(id);
        this.animals = this.animals.filter((animal) => animal.id != id);
        alert("Animal eliminado con éxito");
        this.render();
        this.addListeners();
        //this.loadAnimals();
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
