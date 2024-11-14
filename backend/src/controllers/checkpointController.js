const checkpointRepository = require('../repositories/checkpointRepository');

class CheckpointController {
    async getCheckpoints(req, res) {
        try {
            const checkpoints = await checkpointRepository.getAll();
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(checkpoints));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Falla en el servidor' }));
        }
    }

    async createCheckpoint(req, res) {
        let body = '';
        
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                console.log(body);
                const newCheckpoint = JSON.parse(body);
                if (!this.validateCheckpoint(newCheckpoint)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Ausencia de datos para llevar a cabo una request' }));
                    return;
                }

                await checkpointRepository.create(newCheckpoint);
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ message: 'Checkpoint creado exitosamente' }));
            } catch (error) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Falla en el servidor' }));
            }
        });
    }

    async deleteCheckpoint(req, res, id) {
        try {
            console.log("intentando");
            const deleted = await checkpointRepository.delete(id);
            if (!deleted) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Falla en encontrar una ruta/ el contenido solicitado' }));
                return;
            }
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Checkpoint eliminado exitosamente' }));
        } catch (error) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Falla en el servidor' }));
        }
    }

    async updateCheckpoint(req, res, id) {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', async () => {
            try {
                const updatedCheckpoint = JSON.parse(body);

                console.log(updatedCheckpoint);
                if (!this.validateCheckpoint(updatedCheckpoint)) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Ausencia de datos para llevar a cabo una request ' }));
                    return;
                }
                
                const result = await checkpointRepository.update(id, updatedCheckpoint);
                if (!result) {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Falla en encontrar una ruta/ el contenido solicitado' }));
                    return;
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(result));
            } catch (error) {
                
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Falla en el servidor' }));
            }
        });
    }
    async getCheckpointsData() {
        const checkpoints = await checkpointRepository.getAll();
        return checkpoints;
    }

    validateCheckpoint(checkpoint) {
        return checkpoint.id && checkpoint.lat && checkpoint.long && checkpoint.description;
    }
}

module.exports = new CheckpointController();