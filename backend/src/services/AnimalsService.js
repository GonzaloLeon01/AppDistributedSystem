
import animalsRepository from "../repositories/AnimalsRepository.js";

class AnimalsService {
    animalsRepository = animalsRepository;

    async getAllAnimals() {
        return await this.animalsRepository.getAllAnimals();
    }

    async createAnimal(newAnimal) {
        return await this.animalsRepository.createAnimal(newAnimal);
    }
}

const animalsService = new AnimalsService();
export default animalsService