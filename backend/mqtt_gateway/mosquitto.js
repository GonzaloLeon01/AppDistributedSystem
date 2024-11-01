import mqtt from "mqtt";

const express = require("express");
const app = express();
const port = 3000;
const INTENSIDAD_UMBRAL=-30
//const mqttClient = connect("mqtt://localhost:1883");
const mqttClient = mqtt.connect(process?.env?.MQTT_BROKER_URL);

const topico_checkpoints = "controlpoints";
const archivo_datos="datos.json"
//Estructura para almacenrar puntos de control
const puntosDeControl = new Map()
// Estructura para almacenar vacas
const animales = new Map()

const datos_almacenados={
  puntosDeControl: puntosDeControl,
  animales: animales
}

seguimientoDinamico= new Map()



app.get("/checkpoints", (req, res) => {
  if 

  res.json({
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});


/*
Post para agregar puntos de control
Put Para cambiar puntos de control
Delete para eliminar puestos de control
*/

/*
Lo mismo que con puntos de control pero con animales
*/


app.post("/animal", (req, res) => {
  const macAnimal = req.body?.macAnimal;
  const tipoAnimal = req.body?.tipoAnimal;
  const estado = req.body?.estado

  //agregar mac
  if (macAnimal!=undefined && 
    tipoAnimal!=undefined &&
    estado!=undefined && !(macAnimal in animales)){
    const animal={
      macAnimal: macAnimal,
      tipoAnimal: tipoAnimal,
      estado: estado,
    }
    animales.set(macAnimal,animal)
    return res.send(200);
  } else {
    //Faltan datos o el animal ya esta en la BD
    res.writeHead(400, 'Error, el animal ya se encuentra en la BD o faltan datos')
    res.end()
    return
  }
});

app.put("/animal", (req, res) => {
  const macAnimal = req.body?.macAnimal;
  const tipoAnimal = req.body?.tipoAnimal;
  const estado = req.body?.estado
  if (
    macAnimal!=undefined && 
    tipoAnimal!=undefined &&
    estado!=undefined && macAnimal!=undefined && (macAnimal in animales)){

    const animal={
      macAnimal: macAnimal,
      tipoAnimal: tipoAnimal,
      estado: estado,
    }
    animales.set(macAnimal,animal)
    return res.send(200);
  }
  else {
    res.writeHead(400, 'Error,el animal no se encuentra en la BD o faltan datos')
    res.end()
  }
});

app.delete("/animal", (req, res) => {
  const macAnimal = req.body?.macAnimal
  if (macAnimal!=undefined && (macAnimal in animales)){
    animales.delete(macAnimal)
    return res.send(200);
  }
  else{
    res.writeHead(400, 'Error,el animal no se encuentra en la BD o faltan datos')
    res.end()
  }


});

app.post("/checkpoint", (req, res) => {
  const macCheckpoint = req.body?.macCheckpoint;
  const nombreCheckpoint = req.body?.nombreCheckpoint
  const estado = req.body?.estado
  if (macCheckpoint!=undefined && nombreCheckpoint!=undefined && estado!=undefined && macCheckpoint!=undefined && !(macCheckpoint in puntosDeControl)){
    
    const animal={
      macCheckpoint: macCheckpoint,
      nombreCheckpoint: nombreCheckpoint
    }
    puntosDeControl.set(macCheckpoint,animal)
    //Si el estado es undefines
    return res.send(200);
  }
  else {
    res.writeHead(400, 'Error, el checkpoint ya se encuentra en la BD o faltan datos')
    res.end()
  }
});


app.put("/checkpoint", (req, res) => {
  const macCheckpoint = req.body?.macCheckpoint;
  const nombreCheckpoint = req.body?.nombreCheckpoint 
  const estado = req.body?.estado
  if (macCheckpoint!=undefined && 
    nombreCheckpoint!=undefined &&
    estado!=undefined && 
    macCheckpoint!=undefined && (macCheckpoint in puntosDeControl)){

    const checkpoint={
      macCheckpoint: macCheckpoint,
      nombreCheckpoint: nombreCheckpoint
    }
    puntosDeControl.set(macCheckpoint,checkpoint)
    //Si el estado es undefines
    return res.send(200);
  }
  else {
    res.writeHead(400, 'Error, el checkpoint no se encuentra en la BD o faltan datos')
    res.end()
  }
});

app.delete("/checkpoint", (req, res) => {
  const macCheckpoint = req.body?.macCheckpoint
  if (macCheckpoint!=undefined && (macCheckpoint in puntosDeControl)){
    puntosDeControl.delete(macCheckpoint)
    return res.send(200);
  }
  else{
    res.writeHead(400, 'Error,el checkpoint no se encuentra en la BD o faltan datos')
    res.end()
  }

});

//------------
mqttClient.on('connect', () => {
  mqttClient.subscribe(topico_checkpoints, (err) => {
      if (err) {
          console.error(err);
      }
  });
});
// Llamada en el bloque de verificación MQTT
mqttClient.on("message", (topic, message) => {
  if (topic === topico_checkpoints) {
    try {
      const data = JSON.parse(message.toString());

      if (
        typeof data?.controlPointMAC != undefined &&
        typeof data?.devices != undefined &&
        typeof data?.signalStrength != undefined
      ) { 
        console.log("Mensaje recibido y verificado:", data);

        // Guardar la ubicación del animal
        guardarDatosAnimal(
          data.controlPointId,
          data.devices,
          data.signalStrength
        );
      } else {
        console.error("Formato inválido en el mensaje MQTT recibido:", data);
      }
    } catch (err) {
      console.error("Error al procesar el mensaje MQTT:", err.message);
    }
  }
  //mqttClient.end(); para que sirve?
});

mqttClient.on("error", (err) => {
  console.error("Connection error:", err);
});

function guardarDatosAnimal(checkpointMAC,animalesCheckpointRAW){
  animalesValidos=[]
  animalesCheckpointRAW.forEach(animalCheckpoint => {
    if (animalCheckpoint.intensidad_señal>=INTENSIDAD_UMBRAL){

      if (animalCheckpoint.macAnimal in animales && animales[animalCheckpoint.macAnimal].estado=='activo')
        animalesValidos.push(animales[macAnimal])

    }
  });
  
  if (checkpointMAC in puntosDeControl && puntosDeControl[checkpointMAC].estado=='activo'){
    
    seguimientoDinamico.set(checkpointMAC,animalesValidos)

  }
}



