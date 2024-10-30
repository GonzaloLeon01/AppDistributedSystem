import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class AnimalsRepository {
    async getAllAnimals() {
        const animals = JSON.parse(fs.readFileSync('./database/animals.json', 'utf8'));
        return animals.map(animal => ({ id: animal.id, name: animal.name, description: animal.description }));
    }

    async createAnimal(animal) {
        const animals = JSON.parse(fs.readFileSync('./database/animals.json', 'utf8'));
        const newAnimal = { id: uuidv4(), ...animal };//BTCollar deberia ser pasado como parametro, puede que esta linea sea innecesaria
        animals.push(newAnimal);
        fs.writeFileSync('../database/animals.json', JSON.stringify(animals, null, 2));
        return newAnimal;
    }

}

const animalsRpository = new AnimalsRepository();
export default animalsRpository