const http = require('http');
const url = require('url');
const { verifyToken } = require('./middleware/authMiddleware');
const animalController = require('./controllers/animalController');
const checkpointController = require('./controllers/checkpointController');
const userController = require('./controllers/userController');

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
        // TODO: Implementar lógica para obtener posición de animales
        res.writeHead(501, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Not implemented yet' }));
    } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Ruta no encontrada' }));
    }
});

server.listen(PORT, () => {
    console.log(`Servidor HTTP escuchando en el puerto ${PORT}`);
});

module.exports = server;