const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();
const token_secret = process.env.TOKEN_SECRET;

function generateJWT(payload) {
    const token = jwt.sign(payload, token_secret, { expiresIn: '7h' });
    return token;
}

function verifyJWT(token) {
    try {
        const isValid = jwt.verify(token, token_secret);
        return isValid;
    } catch (error) {
        throw new Error('Invalid token');
    }
}

function decodeJWT(token) {
    const decoded = jwt.decode(token);
    return decoded;
}

module.exports = {
    generateJWT,
    verifyJWT,
    decodeJWT,
};
