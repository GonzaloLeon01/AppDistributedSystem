const jwt = require("jsonwebtoken");
const userRepository = require("../repositories/userRepository");
const {
  accessTokenSecret,
  refreshTokenSecret,
  accessTokenExpiration,
  refreshTokenExpiration,
} = require("../config/auth.config");

class UserController {
  async login(req, res) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const credentials = JSON.parse(body);

        if (!this.validateCredentials(credentials)) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "Ausencia de datos para llevar a cabo una request",
            })
          );
          return;
        }

        const user = await userRepository.verifyCredentials(
          credentials.username,
          credentials.password
        );

        if (user) {
          const accessToken = this.generateAccessToken(user);
          const refreshToken = this.generateRefreshToken(user);

          console.log(accessToken);
          console.log(refreshToken);
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              message: "Login exitoso",
              accessToken,
              refreshToken,
              user: {
                username: user.username,
              },
            })
          );
        } else {
          res.writeHead(401, { "Content-Type": "application/json" });
          res.end(
            JSON.stringify({
              error: "No existe el token, contraseña invalida",
            })
          );
        }
      } catch (error) {
        console.error("Error en login:", error);
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            error: "Falla en el servidor",
          })
        );
      }
    });
  }

  async refresh(req, res) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk.toString();
    });

    req.on("end", async () => {
      try {
        const { refreshToken } = JSON.parse(body);

        if (!refreshToken) {
          res.writeHead(400, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Ausencia de datos para llevar a cabo una request" }));
          return;
        }

        jwt.verify(refreshToken, refreshTokenSecret, async (err, decoded) => {
          if (err) {
            res.writeHead(403, { "Content-Type": "application/json" });
            res.end(JSON.stringify({ error: "Token existente pero erróneo" }));
            return;
          }

          try {
            const user = await userRepository.verifyRefreshToken(
              decoded.username
            );

            if (!user) {
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ error: "Falla en encontrar una ruta/ el contenido solicitado" }));
              return;
            }

            // Generar nuevo access token
            const newAccessToken = this.generateAccessToken(user);

            res.writeHead(200, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({
                accessToken: newAccessToken,
              })
            );
          } catch (error) {
            res.writeHead(500, { "Content-Type": "application/json" });
            res.end(
              JSON.stringify({ error: "Falla en el servidor" })
            );
          }
        });
      } catch (error) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Falla en el servidor" }));
      }
    });
  }

  generateAccessToken(user) {
    return jwt.sign({ username: user.username }, accessTokenSecret, {
      expiresIn: accessTokenExpiration,
    });
  }

  generateRefreshToken(user) {
    return jwt.sign({ username: user.username }, refreshTokenSecret, {
      expiresIn: refreshTokenExpiration,
    });
  }

  validateCredentials(credentials) {
    return credentials.username && credentials.password;
  }
}

module.exports = new UserController();
