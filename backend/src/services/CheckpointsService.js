import checkpointsRepository from "../repositories/CheckpointsRepository.js";

class CheckpointsService {
    checkpointsRepository = checkpointsRepository;

    async getAllCheckpoints() {
        return await this.checkpointsRepository.getAllUsers();
    }

    async createCheckpoint(checkpoint) {
        return await this.checkpointsRepository.createUser(checkpoint);
    }
}

const checkpointsService = new CheckpointsService();
export default checkpointsService