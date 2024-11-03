/* Página principal que muestra la lista de animales y puntos de control */

import AnimalItem from "../components/AnimalItem.js"; // Componente para renderizar un animal
import CheckpointItem from "../components/CheckpointItem.js"; // Componente para renderizar un punto de control
import AnimalsAPIHelper from "../helper/api/AnimalsAPIHelper.js"; // Helper para la API de animales
import CheckpointsAPIHelper from "../helper/api/CheckpointsAPIHelper.js"; // Helper para la API de checkpoints
import AnimalsStateHelper from "../helper/state/AnimalsStateHelper.js"; // Helper para el estado de los animales
import CheckpointsStateHelper from "../helper/state/CheckpointsStateHelper.js"; // Helper para el estado de los checkpoints

export default class HomePage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadData(); // Carga los datos de animales y checkpoints
  }

  async loadData() {
    try {
      const animalsData = await AnimalsAPIHelper.getAnimals(); // Obtiene los animales
      AnimalsStateHelper.setAnimals(animalsData.data.animals); // Almacena los animales en el estado
      const checkpointsData = await CheckpointsAPIHelper.getCheckpoints(); // Obtiene los puntos de control
      CheckpointsStateHelper.setCheckpoints(checkpointsData.data.checkpoints); // Almacena los checkpoints en el estado
      this.render(); // Renderiza la página
    } catch (error) {
      console.error("Error al cargar los datos:", error); // Manejo de errores
    }
  }

  render() {
    const animals = AnimalsStateHelper.getAnimals(); // Obtiene los animales del estado
    const checkpoints = CheckpointsStateHelper.getCheckpoints(); // Obtiene los checkpoints del estado

    let animalsHtml = `
      <h3 class="home-section-title">Animales</h3>
      <div class="home-animal-list">`;

    // Renderiza cada animal usando el componente AnimalItem
    animals.forEach((animal) => {
      animalsHtml += new AnimalItem(animal).render();
    });

    animalsHtml += "</div>";

    let checkpointsHtml = `
      <h3 class="home-section-title">Puntos de Control</h3>
      <div class="home-checkpoint-list">`;

    // Renderiza cada punto de control usando el componente CheckpointItem
    checkpoints.forEach((checkpoint) => {
      checkpointsHtml += new CheckpointItem(checkpoint).render();
    });

    checkpointsHtml += "</div>";

    this.container.innerHTML = animalsHtml + checkpointsHtml; // Inserta el HTML en el contenedor
  }
}
