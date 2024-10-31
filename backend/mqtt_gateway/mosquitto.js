import mqtt from "mqtt";

const express = require("express");
const app = express();
const port = 3000;
const INTENSIDAD_UMBRAL=-30
//const mqttClient = connect("mqtt://localhost:1883");
const mqttClient = mqtt.connect(process?.env?.MQTT_BROKER_URL);

const topico_checkpoints = "controlpoints";
set_checkpoints=new Map()

app.get("/animal", (req, res) => {
  res.json({

  });
});

app.get("/checkpoint", (req, res) => {
  res.json({
    
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

app.post("/animal", (req, res) => {
  const idAnimal = req.body?.idAnimal;
  if () {
    //Si el estado es undefines
    return res.send(400);
  } else {
    return res.send(200);
  }
});

app.post("/checkpoint", (req, res) => {
  const idCheckpoint = req.body?.idCheckpoint;
  if () {
    //Si el estado es undefines
    return res.send(400);
  } else {
    mqttClient.publish(topico_bomba, estado_bomba);
    return res.send(200);
  }
});

/*
Post para agregar puntos de control
Put Para cambiar puntos de control
Delete para eliminar puestos de control
*/

/*
Lo mismo que con puntos de control pero con animales
*/
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
        typeof data?.controlPointId != undefined &&
        typeof data?.animalId != undefined &&
        typeof data?.signalStrength != undefined
      ) { 
        console.log("Mensaje recibido y verificado:", data);

        // Guardar la ubicación del animal
        saveAnimalLocation(
          data.controlPointId,
          data.animalId,
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
