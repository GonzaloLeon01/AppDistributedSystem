const mqtt = require("mqtt");

const client = mqtt.connect("mqtt://test.mosquitto.org");

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
    
*/
  } catch (err) {
    console.error('Error al procesar el mensaje MQTT:', err.message);
  }
});
