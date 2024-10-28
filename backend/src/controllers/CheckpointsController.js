import { isNewcheckpointValid } from '../validations/checkpointsValidations.js';
import checkpointsService from '../services/CheckpointsService.js';

export class CheckpointsController {
    checkpointsService = checkpointsService;

    getAllCheckpoints = async () => {
        try {
            const checkpoints = await this.checkpointsService.getAllCheckpoints();
            return { status: 200, data: checkpoints }; // devolvemos un objeto con el estado y los datos
        } catch (err) {
            return { status: 500, error: 'Error al obtener los checkpoints: ' + err.message };
        }
    }
    createCheckpoint = async (newCheckpoint) => {
        try {
            if (!isNewcheckpointValid(newCheckpoint)) {
                return { status: 400, error: "Invalid checkpoint" };
            }
            const createdCheckpoint = await this.animalsService.createCheckpoint(newCheckpoint);
            return { status: 201, data: createdCheckpoint };
        } catch (err) {
            return { status: 500, error: err.message };
        }
    }
    //deletecheckpoint
}