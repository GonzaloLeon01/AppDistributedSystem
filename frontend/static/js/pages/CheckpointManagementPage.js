/*  Página para gestionar puntos de control, incluyendo añadir, editar y eliminar checkpoints. */

// CheckpointManagementPage.js

import CheckpointsAPIHelper from "../helper/api/CheckpointsAPIHelper.js";

export default class CheckpointManagementPage {
  constructor(selector) {
    this.container = document.getElementById(selector);
    this.loadCheckpoints();
  }

  async loadCheckpoints() {
    try {
      //const data = await CheckpointsAPIHelper.getCheckpoints();
      const data = [
        {
          id: "chk-1234abcd",
          lat: -34.603722,
          long: -58.381592,
          description: "Punto de control cerca del establo principal.",
        },
        {
          id: "chk-5678efgh",
          lat: -34.610768,
          long: -58.382452,
          description: "Control en el área de pastoreo al norte.",
        },
        {
          id: "chk-9012ijkl",
          lat: -34.608301,
          long: -58.387305,
          description:
            "Punto de control junto al río para el suministro de agua.",
        },
        {
          id: "chk-3456mnop",
          lat: -34.605102,
          long: -58.385201,
          description: "Punto de observación en la colina este.",
        },
        {
          id: "chk-7890qrst",
          lat: -34.60405,
          long: -58.3881,
          description: "Punto de control en el área de descanso al sur.",
        },
        {
          id: "chk-1122uvwx",
          lat: -34.6075,
          long: -58.389,
          description: "Punto de control para monitoreo de animales jóvenes.",
        },
      ];
      this.checkpoints = data;
    } catch (error) {
      console.error("Error loading checkpoints:", error);
      this.checkpoints = [];
    } finally {
      this.render();
    }
  }

  async handleAddCheckpoint(event) {
    event.preventDefault();
    const lat = parseFloat(event.target.elements.lat.value);
    const long = parseFloat(event.target.elements.long.value);
    const description = event.target.elements.description.value.trim();

    try {
      await CheckpointsAPIHelper.addCheckpoint({ lat, long, description });
      alert("Punto de control agregado exitosamente");
      this.loadCheckpoints(); // Recarga los checkpoints
    } catch (error) {
      console.error("Error adding checkpoint:", error);
      alert("Error agregando punto de control");
    }
  }

  async handleDeleteCheckpoint(id) {
    try {
      await CheckpointsAPIHelper.deleteCheckpoint(id);
      alert("Punto de control eliminado exitosamente");
      this.loadCheckpoints(); // Recarga los checkpoints
    } catch (error) {
      console.error("Error deleting checkpoint:", error);
      alert("Error eliminando punto de control");
    }
  }

  async handleEditCheckpoint(id, lat, long, description) {
    const newLat = parseFloat(prompt("Nueva latitud:", lat));
    const newLong = parseFloat(prompt("Nueva longitud:", long));
    const newDescription = prompt("Nueva descripción:", description);

    try {
      await CheckpointsAPIHelper.updateCheckpoint(id, {
        lat: newLat,
        long: newLong,
        description: newDescription,
      });
      alert("Punto de control actualizado exitosamente");
      this.loadCheckpoints(); // Recarga los checkpoints
    } catch (error) {
      console.error("Error updating checkpoint:", error);
      alert("Error actualizando punto de control");
    }
  }

  render() {
    const checkpointsHtml = `
      <h2 class="checkpoint-management-title">Gestión de Puntos de Control</h2>
      <form id="add-checkpoint-form" class="add-checkpoint-form">
        <h3>Agregar Nuevo Punto de Control</h3>
        <div>
          <label for="lat">Latitud:</label>
          <input type="number" id="lat" name="lat" required>
        </div>
        <div>
          <label for="long">Longitud:</label>
          <input type="number" id="long" name="long" required>
        </div>
        <div>
          <label for="description">Descripción:</label>
          <input type="text" id="description" name="description" required>
        </div>
        <button type="submit">Agregar Punto de Control</button>
      </form>
      <div class="checkpoint-list">
        ${this.checkpoints
          .map(
            (checkpoint) => `
          <div class="checkpoint-item">
            <p><strong>ID:</strong> ${checkpoint.id}</p>
            <p><strong>Latitud:</strong> ${checkpoint.lat}</p>
            <p><strong>Longitud:</strong> ${checkpoint.long}</p>
            <p><strong>Descripción:</strong> ${checkpoint.description}</p>
            <button onclick="checkpointPage.handleEditCheckpoint('${checkpoint.id}', ${checkpoint.lat}, ${checkpoint.long}, '${checkpoint.description}')">Editar</button>
            <button onclick="checkpointPage.handleDeleteCheckpoint('${checkpoint.id}')">Eliminar</button>
          </div>
        `
          )
          .join("")}
      </div>
    `;
    this.container.innerHTML = checkpointsHtml;

    const addCheckpointForm = document.getElementById("add-checkpoint-form");
    addCheckpointForm.onsubmit = (event) => this.handleAddCheckpoint(event);
  }
}

window.checkpointPage = new CheckpointManagementPage("container");
