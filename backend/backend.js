const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');
const PORT = 3000;

const animalsFilePath = path.join(__dirname, 'animals.json');
const checkpointsFilePath=path.join(__dirname, 'checkpoints.json');
const adminFilePath = path.join(__dirname, 'admin.json');

const app = http.createServer(async(req, res) => {
    const parsedUrl = url.parse(req.url, true); 
    const path = parsedUrl.pathname;
    const method = req.method;

    if (req.method === 'GET' && req.url === '/') {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Backend!\n');
    } 

    if (req.url === '/API/animals' && method === 'GET') {
        const animals = await readData("ANIMAL");
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
                if (compruebaAnimal(newanimal)) {
                    res.statusCode = 400;
                    res.setHeader('Content-Type', 'application/json');
                    res.end(JSON.stringify({ error: 'Faltan algun campo' }));
                    return;
                }
                const animals = await readData("ANIMAL");
                animals.push(newanimal);
                escribeData(animals,res,"ANIMAL");
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
      deleteData(id,res,"ANIMAL");
    }

    if (path.startsWith('/API/animals') && method === 'PATCH') {
      const id = parseInt(path.split('/').pop());
      modificaData(id,res,req,"ANIMAL");
    }

    if (req.url === '/API/checkpoints' && method === 'GET') {
      const checks = await readData("CHECK");
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
              const checkpoints = await readData("CHECK");
              checkpoints.push(newCheckpoint);
              escribeData(checkpoints,res,"CHECK");
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
      deleteData(id,res,"CHECK");  
    }

    if (path.startsWith('/API/checkpoints')  && method === 'PATCH') {
      const id = parseInt(path.split('/').pop());
      modificaData(id,res,req,"CHECK");  
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

              if (compruebaAdmin(newAdmin)) {
                  res.statusCode = 400;
                  res.setHeader('Content-Type', 'application/json');
                  res.end(JSON.stringify({ error: 'Faltan username o password' }));
                  return;
              }
              const admins = await readData("ADMIN");
              admins.push(newAdmin);
              escribeData(admins,res,"ADMIN");
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


function readData(args){
  return new Promise((resolve, reject) => {
    if(args==="CHECK"){
      fs.readFile(checkpointsFilePath, (err, data) => {
        if (err) {
          reject(new Error('Error al leer checkpoints.json'));
        } else {
          const thing = JSON.parse(data);
          resolve(thing.data);
        }
      });
    }
    else if (args==="ANIMAL"){
      fs.readFile(animalsFilePath, (err, data) => {
        if (err) {
          reject(new Error('Error al leer animals.json'));
        } else {
          const thing = JSON.parse(data);
          resolve(thing.data);
        }
      });
    }
    else{
      fs.readFile(adminFilePath, (err, data) => {
        if (err) {
          reject(new Error('Error al leer admin.json'));
        } else {
          const thing = JSON.parse(data);
          resolve(thing.data);
        }
      }); 
    }
  });
}

function escribeData(thing,res,args){
  let path;
  let name;
  if(args==="CHECK"){
    path=checkpointsFilePath;
    name="Checkpoints";
  }
  else if (args==="ANIMAL"){
    path=animalsFilePath;
    name="Animal";
  }
  else{
    path=adminFilePath;
    name="Admin";
  }
  fs.writeFile(path, JSON.stringify({data:thing}), (err) => {
    if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Error al guardar el archivo' }));
        return;
    }
    res.statusCode = 201;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify({ message: name+' creado exitosamente' })); 
  });
}


function deleteData(id1,res,args){
  let path;
  let name;
  let indexToDelete;
  let Array;
  if(args==="CHECK"){
    let datos = JSON.parse(fs.readFileSync(checkpointsFilePath));
    Array=datos.data;
    path=checkpointsFilePath;
    indexToDelete = Array.findIndex(check => check.id === id1);  
    name="Checkpoints";
  }
  else if (args==="ANIMAL"){
    let datos =  JSON.parse(fs.readFileSync(animalsFilePath));
    Array=datos.data;
    path=animalsFilePath;
    indexToDelete = Array.findIndex(animal => animal.id === id1);    
    name="Animal";
  }
  else{
    let datos = JSON.parse(fs.readFileSync(adminFilePath));
    Array=datos.data;
    path=adminFilePath;
    indexToDelete = Array.findIndex(admin => admin.username === id1);    
    name="Admin";
  }

  if (indexToDelete !== -1) {
    Array.splice(indexToDelete, 1);
    fs.writeFileSync(path, JSON.stringify({data:Array}));
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('¡Eliminado!\n');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Error: '+name+' no encontrado\n');
  }
}

function modificaData(id1,res,req,args){

  let path;
  let name;
  let indexToDelete;
  let Array;
  if(args==="CHECK"){
    let datos = JSON.parse(fs.readFileSync(checkpointsFilePath));
    Array=datos.data;
    path=checkpointsFilePath;
    indexToDelete = Array.findIndex(check => check.id === id1);  
    name="Checkpoints";
  }
  else if (args==="ANIMAL"){
    let datos =  JSON.parse(fs.readFileSync(animalsFilePath));
    Array=datos.data;
    path=animalsFilePath;
    indexToDelete = Array.findIndex(animal => animal.id === id1);    
    name="Animal";
  }
  else{
    let datos = JSON.parse(fs.readFileSync(adminFilePath));
    Array=datos.data;
    path=adminFilePath;
    indexToDelete = Array.findIndex(admin => admin.username === id1);    
    name="Admin";
  }

  if (indexToDelete !== -1) {
    let body = '';

    req.on('data', chunk => {
      body += chunk.toString(); 
    });
    req.on('end', async() => {
      const newthing= JSON.parse(body);
      if(args==="ANIMAL"){
        flag=compruebaAnimal(newthing);
      }
      else if("CHECK"){
        flag=compruebaCheck(newthing);
      }
      else{
        flag=compruebaAdmin(newthing);
      }
      if(flag){
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Faltan algun campo' }));
        return;
      }
      Array.splice(indexToDelete, 1);
      Array.push(newthing)
      fs.writeFileSync(path, JSON.stringify({ data: Array }));

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end('¡Remplazado!\n');
    });
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Error: '+name+' no encontrado\n');
  }  
}

function compruebaAdmin(admin){
  if (!admin.username || !admin.password){
    return true;
  }
  return false;
}

function compruebaAnimal(animal){
  if (!animal.id || !animal.name || !animal.description) {
    return true;
  }
  return false;
}
function compruebaCheck(check){
  if (!check.id || !check.lat || !check.long || !check.description) {
    return true;
  }
  return false;
}