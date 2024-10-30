import mqtt from 'mqtt';
import axios from 'axios';

const brokerUrl = process.env.MQTT_BROKER_URL || 'mqtt://localhost:1883';
const client = mqtt.connect(brokerUrl);
// URL de tu servidor HTTP
const httpServerUrl = 'http://localhost:3000/api/animals'; // Cambia esto según tu servidor HTTP

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
    /*
    el mensaje recibido por el arduino es de formato
    Topic configurado en arduino: checkpoint/<uuid>
    {
      checkpointID: <uuid>,
      animals: [
      { id: '11:5e:e7:84:c4:f6', rssi: -50 },
      { id: '7c:0a:3f:83:db:93', rssi: -62 },
      { id: 'c2:5a:3d:ae:10:28', rssi: -73 }
      ]
      }
      se deberian guardar los datos del checkpoint en el server
    
      en arduino enviar:
        // Enviar datos cada cierto tiempo
        StaticJsonDocument<200> doc;
        doc["checkpointID"] = "your-uuid";  // Reemplaza con un UUID real
        JsonArray animals = doc.createNestedArray("animals");
        
        // Agregar datos de animales
        JsonObject animal1 = animals.createNestedObject();
        animal1["id"] = "11:5e:e7:84:c4:f6";
        animal1["rssi"] = -50;
*/
  } catch (err) {
    console.error('Error al procesar el mensaje MQTT:', err.message);
  }
    
});
