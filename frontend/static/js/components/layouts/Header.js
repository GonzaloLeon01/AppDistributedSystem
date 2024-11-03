export default class Header {
  render() {
    return `
        <header>
          <h1>Sistema de Monitoreo de Ganado</h1>
          <nav>
            <a href="/">Inicio</a>
            <a href="/add-animal">Agregar Animal</a>
            <a href="/add-checkpoint">Agregar Punto de Control</a>
            <a href="/login">Iniciar Sesión</a>
          </nav>
        </header>
      `;
  }
}
