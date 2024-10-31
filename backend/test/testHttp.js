
import axios from 'axios';

// URL de tu servidor HTTP
const serverUrl = process.env.SERVER_URL; // Cambia esto según tu servidor

export async function checkServer() {
    checkAnimals();
    checkCheckpoints();
}
async function checkAnimals(){
    try {
        // Hacer una solicitud GET
        const response = await axios.get(serverUrl + '/api/animals');//'/api/animals'
        console.log('Respuesta GET:', response.data);
    } catch (error) {
        console.error('Error en la solicitud GET:', error.message);
    }

    try {
        // Hacer una solicitud POST
        const newAnimal =
            { id: '1',  name : "aminal", description:"descpcion"};
        
        const postData = { message: newAnimal };
        const response = await axios.post(serverUrl+ '/api/animals', JSON.stringify(newAnimal),{
            headers: {
              'Content-Type': 'application/json'
            }});// o JSON.stringify(postData); '/api/animals'
        console.log('Respuesta POST:', response.data);
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }
    try {
        // Hacer una solicitud PATCH
        const modAnimal =
            { name : "aminalM", description:"descpcion2"};
        
        const postData = { message: modAnimal };
        const response = await axios.patch(serverUrl+ '/api/animals/1', postData);// o JSON.stringify(postData); '/api/animals'
        console.log('Respuesta PATCH:', response.data);
    } catch (error) {
        console.error('Error en la solicitud PATCH:', error.message);
    }
    try {
        // Hacer una solicitud DELETE
        const response = await axios.delete(serverUrl + '/API/animals/1');//'/api/animals'
        console.log('Respuesta DELETE:', response.data);
    } catch (error) {
        console.error('Error en la solicitud DELETE:', error.message);
    }
}
async function checkCheckpoints(){
    try {
        // Hacer una solicitud GET
        const response = await axios.get(serverUrl + '/API/checkpoints');//'/api/animals'
        console.log('Respuesta GET:', response.data);
    } catch (error) {
        console.error('Error en la solicitud GET:', error.message);
    }

    try {
        // Hacer una solicitud POST
        const newCheckpoint =
            { id: 'cee1f9bf-6e42-4071-859a-82d71e231cc1',  lat : 10, long:10,description : 'el chuck'};
        
        const postData = { message: newCheckpoint };
        const response = await axios.post(serverUrl+ '/API/checkpoints', postData);// o JSON.stringify(postData); '/api/animals'
        console.log('Respuesta POST:', response.data);
    } catch (error) {
        console.error('Error en la solicitud POST:', error.message);
    }
    try {
        // Hacer una solicitud PATCH
        const modCheckpoint =
        {  lat : 0, long:0,description : 'el chack'};
        
        const postData = { message: modCheckpoint };
        const response = await axios.patch(serverUrl+ '/api/animals/cee1f9bf-6e42-4071-859a-82d71e231cc1', postData);// o JSON.stringify(postData);
        console.log('Respuesta PATCH:', response.data);
    } catch (error) {
        console.error('Error en la solicitud PATCH:', error.message);
    }
    try {
        // Hacer una solicitud DELETE
        const response = await axios.delete(serverUrl + '/API/checkpoints/cee1f9bf-6e42-4071-859a-82d71e231cc1');
        console.log('Respuesta DELETE:', response.data);
    } catch (error) {
        console.error('Error en la solicitud DELETE:', error.message);
    }
}
async function checkUsuarios(){
    
}

