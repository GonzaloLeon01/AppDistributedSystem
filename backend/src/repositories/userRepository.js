const fs = require('fs').promises;
const path = require('path');
const adminFilePath = path.join(__dirname, '../models/admin.json');

class UserRepository {
    async getAll() {
        try {
            const data = await fs.readFile(adminFilePath);
            const users = JSON.parse(data);
            return users.data;
        } catch (error) {
            throw new Error('Error al leer el archivo de administradores');
        }
    }

    async verifyCredentials(username, password) {
        try {
            const users = await this.getAll();
            const user = users.find(u => 
                u.username === username && 
                u.password === password
            );
            return user || null;
        } catch (error) {
            throw new Error('Error al verificar credenciales');
        }
    }

    async verifyRefreshToken(username) {
        try {
            const users = await this.getAll();
            return users.find(u => u.username === username) || null;
        } catch (error) {
            throw new Error('Error al verificar usuario');
        }
    }
}

module.exports = new UserRepository();