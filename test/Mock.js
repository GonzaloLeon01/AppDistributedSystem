import mqtt from 'mqtt';

const brokerUrl = process.env.MQTT_BROKER_URL;
const topic = ;//'students';
const client = mqtt.connect(brokerUrl);

export const startMockedMqttPublishers = () => {
  setInterval(sendRandomData, 5000);
}

function generateRandomData() {
    /*const names = ['Martin', 'Roberto', 'Carlos', 'Fernando', 'Leticia'];
    const name = names[Math.floor(Math.random() * names.length)];
    const timestamp = new Date().toISOString();
    const rate = Math.floor(Math.random() * 100) + 1;
    const errors = [1, 2, 3, 4, 5, 6];
    const error = errors[Math.floor(Math.random() * errors.length)];
    return {
        name: name,
        timestamp: timestamp,
        rate: rate,
        errors: [error]
    };*/
}

function sendRandomData() {
    /*const data = generateRandomData();
    const message = JSON.stringify(data);
    client.publish(topic, message);
    console.log('Mensaje enviado:', message);*/
}

client.on('connect', function () {
    console.log('Conectado al broker correctamente.');
});

client.on('error', function (error) {
    console.error('Error:', error, brokerUrl);
});