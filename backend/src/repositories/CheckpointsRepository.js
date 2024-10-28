import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class CheckpointsRepository {
    async getAllCheckpoints() {
        const checkpoints = JSON.parse(fs.readFileSync('./database/checkpoints.json', 'utf8'));
        return checkpoints.map(animal => ({ id: checkpoint.id, lat: checkpoint.lat,long: checkpoint.long, description: checkpoint.description }));
    }

    async createCheckpoint(checkpoint) {
        const checkpoints = JSON.parse(fs.readFileSync('./database/checkpoint.json', 'utf8'));
        const newCheckpoint = { id: uuidv4(), ...checkpoint };
        checkpoints.push(newAnimal);
        fs.writeFileSync('../database/checkpoint.json', JSON.stringify(checkpoints, null, 2));
        return newCheckpoint;
    }

}

const checkpointsRepository = new CheckpointsRepository();
export default checkpointsRepository