import bcrypt from 'bcrypt';
import userService from '../services/UserService.js';
import jwt from 'jsonwebtoken';

const secret = process.env.JWT_SECRET;

export class AuthController {
    userService = userService

    login = async (id, password) => {
        try {
            //const { id, password } = req.body;
            if (!id || !password) {
                return { status: 400, error: "Missing id or password" };
                //return res.status(400).json({ message: "Missing id or password" });
            }
            const users = await this.userService.getAllUsers();
            const user = users.find(user => user.id === id);
            if (!user) {
                return { status: 404, error: "User not found" };
                //return res.status(404).json({ message: "User not found" });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return { status: 401, error: "Incorrect password" };
                //return res.status(401).json({ message: "Incorrect password" });
            }
            const payload = {
                id: user.id,
                name: user.name
            }
            const accessToken = jwt.sign(payload, secret, { expiresIn: '1h' });
            const refreshToken = jwt.sign(payload, secret, { expiresIn: '1d' });
            return { status: 200, accessToken : accessToken, refreshToken : refreshToken, playload : payload};//llamar a res.send({ accessToken, refreshToken, ...payload });
            //res.send({ accessToken, refreshToken, ...payload });
        } catch (err) {
            return { status: 500, error: err.message  };
            //res.status(500).json({ message: err.message });
        }
    }

    refresh = async (refreshToken) => {
        try {
            //const refreshToken = req?.body?.refreshToken;
            if (!refreshToken) {
                return { status: 401, error: 'Access Denied. No refresh token provided.'  };
                //return res.status(401).send('Access Denied. No refresh token provided.');
            }
            const decoded = jwt.verify(refreshToken, secret);
            const accessToken = jwt.sign({ ...decoded }, secret, { expiresIn: '1h' });
            return { status: 200, accessToken : accessToken, refreshToken : refreshToken};
            //res.send({ accessToken, refreshToken });
        } catch (error) {
            return { status: 400, error: 'Invalid refresh token.'  };
            //return res.status(400).send('Invalid refresh token.');
        }
    }
}