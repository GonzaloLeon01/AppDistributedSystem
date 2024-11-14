const express = require('express');
const cors = require('cors');
const { verifyToken } = require('./middleware/authMiddleware');
const animalController = require('./controllersExpress/animalController');
const checkpointController = require('./controllersExpress/checkpointController');
const userController = require('./controllersExpress/userController');
const mqttController = require('./controllersExpress/mqttController');
require('dotenv').config();

const app = express();

const corsOptions = {
  origin: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());


async function getPosition(req, res) {
  try {
    let temporalArray = [];
    const animalData = await animalController.getAnimalsData();
    const checkData = await checkpointController.getCheckpointsData();
    const allChecks = mqttController.getAnimalsInAllCheckpoint(res);
    
    allChecks.forEach((element) => {
      const index = checkData.findIndex((c) => c.id === element.checkpoint);
      if (index !== -1) {
        let temporalcheck = {
          id: checkData[index].id,
          lat: checkData[index].lat,
          long: checkData[index].long,
          description: checkData[index].description || "",
          animals: [],
        };
        
        element.animals.forEach((animal) => {
          const index2 = animalData.findIndex((c) => c.id === animal);
          if (index2 !== -1) {
            temporalcheck.animals.push(animalData[index2]);
          }
        });
        temporalArray.push(temporalcheck);
      }
    });
    
    res.status(200).json(temporalArray);
  } catch (error) {
    res.status(400).json({ error: "Error al procesar el JSON" });
  }
}

// Rutas publicas
app.post('/API/login', userController.login);
app.post('/API/refresh', userController.refresh);

// Middleware de autenticación para rutas protegidas
app.use('/API', (req, res, next) => {
  if (req.path === '/login' || req.path === '/refresh') return next();
  verifyToken(req, res, next);
});

// Rutas de animales
app.get('/API/animals', animalController.getAnimals);
app.post('/API/animals', animalController.createAnimal);
app.delete('/API/animals/:id', animalController.deleteAnimal);
app.patch('/API/animals/:id', animalController.updateAnimal);

// Rutas de checkpoints
app.get('/API/checkpoints', checkpointController.getCheckpoints);
app.post('/API/checkpoints', checkpointController.createCheckpoint);
app.delete('/API/checkpoints/:id', checkpointController.deleteCheckpoint);
app.patch('/API/checkpoints/:id', checkpointController.updateCheckpoint);

// Otras rutas
app.get('/API/animals/position', getPosition);
app.get('/API/availableDevices', (req, res) => mqttController.getAllCheckpoints(res));

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found' });
});

// Iniciar servidor
app.listen(process.env.PORTHTTP, () => {
  console.log(`Servidor Express escuchando en el puerto ${process.env.PORTHTTP}`);
});

module.exports = app;