import userRepository from "../repositories/UserRepository.js";

class UserService {
    userRepository = userRepository;

    async getAllUsers() {
        return await this.userRepository.getAllUsers();
    }

    async createUser(user) {
        return await this.userRepository.createUser(user);
    }
}

const userService = new UserService();
export default userService