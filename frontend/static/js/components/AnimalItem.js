export default class AnimalItem {
  constructor({ id, name, description }) {
    this.id = id;
    this.name = name;
    this.description = description;
  }

  render() {
    return `
      <div class="animal-item">
        <h4>${this.name}</h4>
        <p>${this.description}</p>
        <button onclick="navigateTo('/edit-animal/${this.id}')">Editar</button>
        <button onclick="deleteAnimal('${this.id}')">Eliminar</button>
      </div>
    `;
  }
}
