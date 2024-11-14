const animalRepository = require("../repositories/animalRepository");

class AnimalController {
  async getAnimals(req, res) {
    try {
      const animals = await animalRepository.getAll();
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(animals));
    } catch (error) {
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Falla en el servidor" }));
    }
  }

  async createAnimal(req, res) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const newAnimal = JSON.parse(body);
        if (!this.validateAnimal(newAnimal)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Ausencia de datos para llevar a cabo una request" }));
          return;
        }

        await animalRepository.create(newAnimal);
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ message: "Animal creado exitosamente" }));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Falla en el servidor" }));
      }
    });
  }

  async deleteAnimal(req, res, id) {
    try {
      console.log(id);
      //const deleted = await animalRepository.delete(parseInt(id));
      const deleted = await animalRepository.delete(id);
      console.log(deleted);
      if (!deleted) {
        res.writeHead(404, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Falla en encontrar una ruta/ el contenido solicitado" }));
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ message: "Animal eliminado exitosamente" }));
    } catch (error) {
      console.log(error);
      res.writeHead(500, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Falla en el servidor" }));
    }
  }

  async updateAnimal(req, res, id) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const updatedAnimal = JSON.parse(body);
        if (!this.validateAnimal(updatedAnimal)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Ausencia de datos para llevar a cabo una request" }));
          return;
        }

        const result = await animalRepository.update(
          id,
          updatedAnimal
        );
        if (!result) {
          res.writeHead(404, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Falla en encontrar una ruta/ el contenido solicitado" }));
          return;
        }

        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(result));
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Falla en el servidor" }));
      }
    });
  }

  validateAnimal(animal) {
    return animal.id && animal.name && animal.description;
  }

  async getAnimal() {
    const animals = await animalRepository.getAll();
  }

  async getAnimalsData() {
    const animals = await animalRepository.getAll();
    return animals;
  }
}

module.exports = new AnimalController();
