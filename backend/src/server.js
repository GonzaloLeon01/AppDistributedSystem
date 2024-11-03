const http = require('http');
const url = require('url');
const { verifyToken } = require('./middleware/authMiddleware');
const animalController = require('./controllers/animalController');
const checkpointController = require('./controllers/checkpointController');
const userController = require('./controllers/userController');
const mqttController = require('./controllers/mqttController');

const PORT = 3000;

const server = http.createServer(async (req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // Rutas publicas
    if (method === 'GET' && path === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Backend!\n');
        return;
    }

    if (path === '/API/login' && method === 'POST') {
        await userController.login(req, res);
        return;
    }

    if (path === '/API/refresh' && method === 'POST') {
        await userController.refresh(req, res);
        return;
    }

    if (!verifyToken(req, res)) {
        return;
    }

    // Rutas protegidas
    if (path === '/API/animals' && method === 'GET') {
        await animalController.getAnimals(req, res);
    } else if (path === '/API/animals' && method === 'POST') {
        await animalController.createAnimal(req, res);
    } else if (path.match(/^\/API\/animals\/\d+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await animalController.deleteAnimal(req, res, id);
    } else if (path.match(/^\/API\/animals\/\d+$/) && method === 'PATCH') {
        const id = path.split('/').pop();
        await animalController.updateAnimal(req, res, id);


    } else if (path === '/API/checkpoints' && method === 'GET') {
        await checkpointController.getCheckpoints(req, res);
    } else if (path === '/API/checkpoints' && method === 'POST') {
        await checkpointController.createCheckpoint(req, res);
    } else if (path.match(/^\/API\/checkpoints\/\d+$/) && method === 'DELETE') {
        const id = path.split('/').pop();
        await checkpointController.deleteCheckpoint(req, res, id);
    } else if (path.match(/^\/API\/checkpoints\/\d+$/) && method === 'PATCH') {
        const id = path.split('/').pop();
        await checkpointController.updateCheckpoint(req, res, id);


    } else if (path === '/API/animals/position' && method === 'GET') {
        let temporalcheck;
        let temporalArray=[];
        const animalData=await animalController.getAnimalsData();
        const checkData=await checkpointController.getCheckpointsData();
        const allChecks=mqttController.getAnimalsInAllCheckpoint(res);
        allChecks.forEach(element => {
            const index = checkData.findIndex(c=> c.id === element.checkpoint);   
            if (index != -1){
                temporalcheck={
                    id: checkData[index].id,
                    lat: checkData[index].lat,
                    long: checkData[index].long,
                    description: checkData[index].description || '', 
                    animals: []
                }
                element.animals.forEach(animal => {
                    const index2 = animalData.findIndex(c=> c.id === animal);    
                    if (index2 != -1){
                        temporalcheck.animals.push(animalData[index2]);  
                    }
                });
                temporalArray.push(temporalcheck);
            }
        });
        try{
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(temporalArray));
        } catch (error) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Error al procesar el JSON' }));
        }
    }else if (path === '/API/availableDevices' && method === 'GET') {
    const allChecks=mqttController.getAllCheckpoints(res);
    }
});

server.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${PORT}`);
});

module.exports = server;