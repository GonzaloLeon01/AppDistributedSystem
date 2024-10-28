const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://test.mosquitto.org");
const PORT = 3000;

const animalsFilePath = path.join(__dirname, 'animals.json');
const checkpointsFilePath=path.join(__dirname, 'checkpoints.json');
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


const app = http.createServer(async(req, res) => {
    const parsedUrl = url.parse(req.url, true); 
    const path = parsedUrl.pathname;
    const method = req.method;

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Backend!\n');
    } 

    if (req.url === '/API/animals' && method === 'GET') {

        const animals = readAnimalsData();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(animals));
    }

    if (req.url === '/API/animals' && method === 'POST') {
        let body = '';

        req.on('data', chunk => {
        body += chunk.toString(); 
        });

        req.on('end', async() => {
            try {
                
                const newanimal = JSON.parse(body);

                if (!newanimal.id || !newanimal.name || !newanimal.description) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Faltan algun campo' }));
                    return;
                }
                const animals = await leeCheckPoints();
                
                animals.data.push(newanimal);

                escribeAnimales(animals,res);
              }
             catch (e) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Error al procesar el JSON' }));
              }
        });  
    }

    if (path.startsWith('/API/animals') && method === 'DELETE') {
      const id = parseInt(path.split('/').pop());
      deleteAnimal(id,res);
    }

    if (path.startsWith('/API/animals') && method === 'PATCH') {
      const id = parseInt(path.split('/').pop());
      modificarAnimal(id,res,req);
    }

    if (req.url === '/API/checkpoints' && method === 'GET') {
      console.log("entra");
      const checks = readCheckPointsData();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(checks));
    }
    if (req.url === '/API/checkpoints' && method === 'POST') {
        let body = '';
       
        req.on('data', chunk => {
        body += chunk.toString(); 
        });

        req.on('end', async() => {
            try {
                const newCheckpoint = JSON.parse(body);
                if(compruebaCheck(newCheckpoint)){
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Faltan algun campo' }));
                  return;
                }
                const checkpoints = await leeCheckPoints();
                
                checkpoints.data.push(newCheckpoint);

                escribeCheckPoints(checkpoints,res);
              }
             catch (e) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Error al procesar el JSON' }));
              }
        });    
    }

    if (path.startsWith('/API/checkpoints')  && method === 'DELETE') {
      const id = parseInt(path.split('/').pop());
      deleteCheckPoint(id,res);  
    }

    if (path.startsWith('/API/checkpoints')  && method === 'PATCH') {
      const id = parseInt(path.split('/').pop());
      modificarCheckpoint(id,res,req);  
    }

    if (req.url === '/API/animals/position' && method === 'GET') {
      
    }

    if (method === 'POST' && parsedUrl.pathname === `/API/refresh/`) { 

    }

    if (method === 'POST' && parsedUrl.pathname === `/API/login`) {
        let body = '';

        req.on('data', chunk => {
        body += chunk.toString();
        });

        req.on('end', async() => {
            try {
                const newAdmin = JSON.parse(body);

                if (!newAdmin.username || !newAdmin.password) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Faltan username o password' }));
                    return;
                }
                  const admins = await leeAdmins();
                  escribeAdmins(admins,res);
            } catch (e) {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Error al procesar el JSON' }));
            }
        });    
  }
});

app.listen(PORT, () => {
    console.log(`HTTP escuchando en el puerto ${PORT}`);
});

function addAnimal(animal) {
  const animals = JSON.parse(fs.readFileSync(animalsFilePath));
  animals.push(animal);
  fs.writeFileSync(animalsFilePath, JSON.stringify(animals));
}

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

function deleteAnimal(id1,res) {
  const animals = JSON.parse(fs.readFileSync(animalsFilePath));

  const animalsArray = animals.data;

  const indexToDelete = animalsArray.findIndex(animal => animal.id === id1);  

  if (indexToDelete !== -1) {
    // Elimina el animal si se encuentra el índice
    animalsArray.splice(indexToDelete, 1);
    fs.writeFileSync(animalsFilePath, JSON.stringify({ data: animalsArray }));
    // Respuesta de éxito
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('¡Eliminado!\n');
  } else {
    // Manejo del error si no se encuentra el animal
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Error: Animal no encontrado\n');
  }
}

function modificarAnimal(id1,res,req) {
  const animals = JSON.parse(fs.readFileSync(animalsFilePath));

  const animalsArray = animals.data;

  const indexToDelete = animalsArray.findIndex(animal => animal.id === id1);  
  if (indexToDelete !== -1) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString(); 
    });
    req.on('end', async() => {
      const newanimal = JSON.parse(body);
      if (!newanimal.id || !newanimal.name || !newanimal.description) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Faltan algun campo' }));
        return;
      }
      // Elimina el animal si se encuentra el índice
      animalsArray.splice(indexToDelete, 1);
      animalsArray.push(newanimal)
      fs.writeFileSync(animalsFilePath, JSON.stringify({ data: animalsArray }));

      // Respuesta de éxito
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('¡Remplazado!\n');
    });
  } else {
    // Manejo del error si no se encuentra el animal
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Error: Animal no encontrado\n');
  }
}

function escribeAnimales(animals,res){
  fs.writeFile(animalsFilePath, JSON.stringify(animals, null, 2), (err) => {
    if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Error al guardar el archivo' }));
        return;
    }
    // Responder con éxito
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Animal creado exitosamente' })); 
  });
}

function leeAnimales() {
  return new Promise((resolve, reject) => {
    fs.readFile(animalsFilePath, (err, data) => {
      if (err) {
        reject(new Error('Error al leer animals.json'));
      } else {
        const animals = JSON.parse(data);
        resolve(animals);
      }
    });
  });
}

function readCheckPointsData(){
  try {
    const data = fs.readFileSync(checkpointsFilePath);
    return JSON.parse(data);
  } catch (err) {
    console.error('Error al leer el archivo JSON:', err);
    return {};
  }
}

function leeCheckPoints(){
  return new Promise((resolve, reject) => {
    fs.readFile(checkpointsFilePath, (err, data) => {
      if (err) {
        reject(new Error('Error al leer animals.json'));
      } else {
        const checks = JSON.parse(data);
        resolve(checks);
      }
    });
  });
}

function escribeCheckPoints(checkpoints,res){
  fs.writeFile(checkpointsFilePath, JSON.stringify(checkpoints, null, 2), (err) => {
    if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Error al guardar el archivo' }));
        return;
    }
    // Responder con éxito
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Checkpoint creado exitosamente' })); 
  });
}


function deleteCheckPoint(id1,res){
  const checks = JSON.parse(fs.readFileSync(checkpointsFilePath));

  const checksArray = checks.data;

  const indexToDelete = checksArray.findIndex(check => check.id === id1);  

  if (indexToDelete !== -1) {
    checksArray.splice(indexToDelete, 1);
    fs.writeFileSync(checkpointsFilePath, JSON.stringify({ data: checksArray }));
    // Respuesta de éxito
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('¡Eliminado!\n');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Error: CheckPoint no encontrado\n');
  }
}

function modificarCheckpoint(id1,res,req){
  const checks = JSON.parse(fs.readFileSync(checkpointsFilePath));
  const checksArray = checks.data;
  const indexToDelete = checksArray.findIndex(check => check.id === id1);

  if (indexToDelete !== -1) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString(); 
    });
    req.on('end', async() => {
      const newcheck = JSON.parse(body);
      if(compruebaCheck(newcheck)){
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Faltan algun campo' }));
        return;
      }
      checksArray.splice(indexToDelete, 1);
      checksArray.push(newcheck)
      fs.writeFileSync(checkpointsFilePath, JSON.stringify({ data: checksArray }));

      // Respuesta de éxito
      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('¡Remplazado!\n');
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Error: CheckPoint no encontrado\n');
  }  
}

function compruebaCheck(check){
  if (!check.id || !check.lat || !check.long || !check.description) {
    return true;
  }
  return false;
}


function leeAdmins(){
  return new Promise((resolve, reject) => {
    fs.readFile(adminFilePath, (err, data) => {
      if (err) {
        reject(new Error('Error al leer animals.json'));
      } else {
        const admins = JSON.parse(data);
        resolve(admins);
      }
    });
  });
}

function escribeAdmins(admins,res){
  fs.writeFile(adminFilePath, JSON.stringify(admins, null, 2), (err) => {
    if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Error al guardar el archivo' }));
        return;
    }
    // Responder con éxito
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: 'Admin creado exitosamente' })); 
  });
}