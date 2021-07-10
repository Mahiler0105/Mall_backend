const { sign } = require('jsonwebtoken');
// const { JWT_SECRET } = require('../config');

const fs = require('fs');

const PRIVATE_KEY = fs.readFileSync('./src/lib/keys/lerietmall.key');
const ADMIN_SECRET = fs.readFileSync('./src/lib/keys/admin.key');
// const { ADMIN_SECRET } = require('../config');

module.exports.generateToken = function (user) {
    // return sign({ user }, JWT_SECRET, { expiresIn: '4h' });
    return sign({ user }, PRIVATE_KEY, {
        expiresIn: '30m',
        audience: 'https://www.lerietmall.net',
        issuer: 'legion@lerietmall-302923.iam.gserviceaccount.com',
        subject: String(user.id) || String(user.sessionId),
        algorithm: 'RS256',
    });
};

module.exports.decodeToken = function (token) {
    const base64Payload = token.split('.')[1];
    const payload = Buffer.from(base64Payload, 'base64');
    return JSON.parse(payload.toString());
};

module.exports.adminToken = function (data) {
    return sign(data, ADMIN_SECRET, {
        expiresIn: '15m',
        audience: 'https://www.lerietmall.net',
        issuer: 'legion@lerietmall-302923.iam.gserviceaccount.com',
        subject: "admin@gmail.com",
        algorithm: 'RS256',
    });
};