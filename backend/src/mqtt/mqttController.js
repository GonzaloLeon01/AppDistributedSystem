import mqtt from 'mqtt';
import axios from 'axios';

const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const client = mqtt.connect(brokerUrl);
// URL de tu servidor HTTP
const httpServerUrl = 'http://localhost:3000/api/animals'; // Cambia esto según tu servidor HTTP, esto para que con axios se patcheen las posiciones

// Subscribir al tópico donde los Puntos de Control publicarán los datos
//Suscripción a topic desde el servidor: checkpoint/<id>
//Topic configurado en arduino: checkpoint/<uuid>

client.on('connect', () => {

  client.subscribe('checkpoint', (err) => {
    if (!err) {
      console.log('Suscrito a los Puntos de Control');
    }
  });
});


// Llamada en el bloque de verificación MQTT
client.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log('Mensaje recibido en topic:', topic);
    console.log('Checkpoint ID:', data.checkpointID);
    data.animals.forEach(animal => {
      console.log('Animal ID:', animal.id, 'RSSI:', animal.rssi);
  });
  } catch (err) {
    console.error('Error al procesar el mensaje MQTT:', err.message);
  }
    
});
