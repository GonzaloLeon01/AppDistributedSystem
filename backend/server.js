//const http = require('http');
import http from 'http';
//const url = require('url');
import url from 'url';
import './src/mqtt/mqttController.js';
import { AnimalsController } from './src/controllers/AnimalsController.js';
import { CheckpointsController } from './src/controllers/CheckpointsController.js';
import { AuthController } from './src/controllers/AuthController.js';

const animalsController = new AnimalsController();
const checkpointsController = new CheckpointsController();
const authController = new AuthController();


const app = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true); // Analiza la URL y extrae los parámetros de consulta

  //ROUTES

  if (req.method === 'GET' && req.url === '/') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Backend!\n');
  }

  else if (req.method === 'POST' && parsedUrl.pathname === `/api/animals`) { //aca seria para poder agregar un animal
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      const newAnimal = JSON.parse(body);
      const result = await animalsController.createAnimal(newAnimal);

      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.data || { message: result.error }));
    });
  }
  else if (req.method === 'GET' && parsedUrl.pathname === `/api/animals`) {
    const result = await animalsController.getAllAnimals();

    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.data || { message: result.error }));
  }
  else if (req.method === 'GET' && parsedUrl.pathname === `/api/animals/position`) {
    /* logica para obtener la posicion de los animales
      id
      lat
      long
        description
        animals: [
  
        ]
    */
  }
  else if (req.method === 'DELETE' && parsedUrl.pathname === `/api/animals/id`) {
    //logica para eliminar animal por id
  }
  else if (req.method === 'PATCH' && parsedUrl.pathname === `/api/animals/id`) {

  }

  else if (req.method === 'POST' && parsedUrl.pathname === `/api/checkpoints`) {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', async () => {
      const newCheckpoint = JSON.parse(body);
      const result = await checkpointsController.createCheckpoint(newCheckpoint);

      res.writeHead(result.status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result.data || { message: result.error }));
    });
  }
  else if (req.method === 'GET' && parsedUrl.pathname === `/api/checkpoints`) {
    const result = await checkpointsController.getAllCheckpoints();

    res.writeHead(result.status, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(result.data || { message: result.error }));
  }
  else if (req.method === 'DELETE' && parsedUrl.pathname === `/api/checkpoints/id`) {

  }
  else if (req.method === 'PATCH' && parsedUrl.pathname === `/api/checkpoints/id`) {

  }

  else if (req.method === 'POST' && parsedUrl.pathname === `/api/refresh`) {
    /*
    mandas:
      header.auth.bearer
      refreshToken
 
    devuelve:
    {
      refreshToken
    accessToken
    }
    */
    const bearer = req.headers.authorization?.split(" ")[1];//no se si el refreshToken esta en el header o en el query :P
    const refreshToken = parsedUrl.query.refreshToken;
    try {
      const result = await authController.refresh(refreshToken);

      if (result.status === 200) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ accessToken: result.accessToken, refreshToken: result.refreshToken }));
      } else {
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: result.error }));
      }
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  }
  else if (req.method === 'POST' && parsedUrl.pathname === `/api/login`) {
    /*
      mandas
      header.auth
      {
        username:
        password:
      }
 
      devuelve:
      {
        access token
        refresh token
        id
      }
    */
      let body = '';
      req.on('data', chunk => {
          body += chunk.toString(); 
      });
      req.on('end', async () => {
        const { username, password } = JSON.parse(body); // Supongamos que las credenciales se envían en formato JSON

        // Llama a la función de login pasando username y password
        const result = await authController.login(username, password); // Asegúrate de referenciar correctamente a tu controlador
        
        // Envía la respuesta al cliente
        res.writeHead(result.status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(result)); // que haria res.send({ accessToken, refreshToken, ...payload });
    });
    req.on('error', (err) => {
        console.error('Error en la solicitud:', err);
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
    });
  }
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

//server
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`HTTP escuchando en el puerto ${PORT}`);
});
import { startMockedMqttPublishers } from './test/Mock.mjs';

startMockedMqttPublishers();