import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

class UserRepository {
    async getAllUsers() {
        const users = JSON.parse(fs.readFileSync('./database/admin.json', 'utf8'));
        return users.map(user => ({ id: user.id, username: user.name, password: user.password }));
    }

    async createUser(user) {
        const users = JSON.parse(fs.readFileSync('./database/admin.json', 'utf8'));
        const newUser = { id: uuidv4(), ...user };
        users.push(newUser);
        fs.writeFileSync('./database/admin.json', JSON.stringify(users, null, 2));
        return newUser;
    }
}

const userRepository = new UserRepository();
export default userRepository