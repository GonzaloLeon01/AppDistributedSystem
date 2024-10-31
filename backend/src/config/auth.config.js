require('dotenv').config();

module.exports = {
    accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'ignacio',
    refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'cantando',
    accessTokenExpiration: '15m',  // 15 minutos
    refreshTokenExpiration: '7d'   // 7 dias
};