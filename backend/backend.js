const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://test.mosquitto.org");

const animalsFilePath = path.join(__dirname, 'animals.json');
const adminFilePath = path.join(__dirname, 'admin.json');

// Subscribir al tópico donde los Puntos de Control publicarán los datos
client.on('connect', () => {
    client.subscribe('controlpoints', (err) => {
        if (!err) {
            console.log('Suscrito a los Puntos de Control');
        }
    });
});

  // Llamada en el bloque de verificación MQTT
  client.on('message', (topic, message) => {
    try {
      const data = JSON.parse(message.toString());
  
      if (typeof data.controlPointId === 'string' &&
          typeof data.animalId === 'string' &&
          typeof data.signalStrength === 'number') {
        
        console.log('Mensaje recibido y verificado:', data);
  
        // Guardar la ubicación del animal
        saveAnimalLocation(data.controlPointId, data.animalId, data.signalStrength);
  
      } else {
        console.error('Formato inválido en el mensaje MQTT recibido:', data);
      }
    } catch (err) {
      console.error('Error al procesar el mensaje MQTT:', err.message);
    }
  });


function addAnimal(animal) {
    const animals = JSON.parse(fs.readFileSync(animalsFilePath));
    animals.push(animal);
    fs.writeFileSync(animalsFilePath, JSON.stringify(animals));
}

const app = http.createServer(async(req, res) => {
    const parsedUrl = url.parse(req.url, true); // Analiza la URL y extrae los parámetros de consulta
    //const queryParams = parsedUrl.query;

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Backend!\n');
    } 
    if (req.url === '/api/animals' && req.method === 'GET') {
        // Leer y devolver el archivo animals.json
        const animals = readAnimalsData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(animals));
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
    if (req.method === 'GET' && parsedUrl.pathname === `/api/user/`) {  

    }

    if (req.method === 'POST' && parsedUrl.pathname === `/api/animal`) { //aca seria para poder agregar un animal

    }

    if (req.method === 'POST' && parsedUrl.pathname === `/api/user`) {//aca seria para poder agregar un usuario

    }
});


const PORT = 3000;

app.listen(PORT, () => {
    console.log(`HTTP escuchando en el puerto ${PORT}`);
});

// Función para leer el archivo animals.json
function readAnimalsData() {
    try {
      const data = fs.readFileSync('animals.json');
      return JSON.parse(data);
    } catch (err) {
      console.error('Error al leer el archivo JSON:', err);
      return {};
    }
  }
  
  // Función para guardar la ubicación del animal en el archivo JSON
  function saveAnimalLocation(controlPointId, animalId, signalStrength) {
    const animalsData = readAnimalsData();
  
    // Actualiza la ubicación del animal con la nueva información
    animalsData[animalId] = {
      controlPointId: controlPointId,
      signalStrength: signalStrength,
      timestamp: new Date().toISOString()
    };
  
    // Escribir el archivo actualizado
    fs.writeFileSync('animals.json', JSON.stringify(animalsData, null, 2), (err) => {
      if (err) {
        console.error('Error al guardar en el archivo JSON:', err);
      }
    });
  }
  