const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://test.mosquitto.org");

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