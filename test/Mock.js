import mqtt from 'mqtt';

const brokerUrl = process.env.MQTT_BROKER_URL;
const topic = 'checkpoint';
const client = mqtt.connect(brokerUrl);

export const startMockedMqttPublishers = () => {
  setInterval(sendRandomData, 5000);
}

function generateRandomData() {
    /*
    crear checkpoints con animales para enviar en mqtt

    */
}

function sendRandomData() {
    const data = generateRandomData();
    const message = JSON.stringify(data);
    client.publish(topic, message);
    console.log('Mensaje enviado:', message);
}

client.on('connect', function () {
    console.log('Conectado al broker correctamente.');
});

client.on('error', function (error) {
    console.error('Error:', error, brokerUrl);
});

//import { startMockedMqttPublishers } from './test/Mock.js';