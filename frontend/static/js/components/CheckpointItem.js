export default class CheckpointItem {
  constructor({ id, lat, long, description }) {
    this.id = id;
    this.lat = lat;
    this.long = long;
    this.description = description;
  }

  render() {
    return `
      <div class="checkpoint-item">
        <h4>${this.description}</h4>
        <p>Latitud: ${this.lat}, Longitud: ${this.long}</p>
        <button onclick="navigateTo('/edit-checkpoint/${this.id}')">Editar</button>
        <button onclick="deleteCheckpoint('${this.id}')">Eliminar</button>
      </div>
    `;
  }
}
