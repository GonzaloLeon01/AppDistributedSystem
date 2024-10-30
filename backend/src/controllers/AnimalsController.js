//import { isNewAnimalValid } from '../validations/animalsValidations.js';
const { isNewAnimalValid } = require('../validations/animalsValidations.js');
//import animalsService from '../services/AnimalsService.js';
const { animalsService } = require('../services/AnimalsService.js');

export class AnimalsController {
    animalsService = animalsService;z

    getAllAnimals = async () => {
        try {
            const animals = await this.animalsService.getAllAnimals();
            return { status: 200, data: animals }; // devolvemos un objeto con el estado y los datos
        } catch (err) {
            return { status: 500, error: 'Error al obtener los animales: ' + err.message };
        }
    }
    createAnimal = async (newAnimal) => {
        try {
            if (!isNewAnimalValid(newAnimal)) {
                return { status: 400, error: "Invalid animal" };
            }
            const createdAnimal = await this.animalsService.createAnimal(newAnimal);
            return { status: 201, data: createdAnimal };
        } catch (err) {
            return { status: 500, error: err.message };
        }
    }
    //deleteAnimal
}