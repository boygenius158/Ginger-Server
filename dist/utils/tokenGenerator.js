"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenGenerator = void 0;
// tokenGenerator.ts
const jwt = require('jsonwebtoken');
class TokenGenerator {
    generateToken(payload, secretKey, expiresIn) {
        return jwt.sign(payload, secretKey, { expiresIn });
    }
    verifyToken(token, secretKey) {
        try {
            return jwt.verify(token, secretKey);
        }
        catch (error) {
            console.error('Error verifying token:', error);
            return null;
        }
    }
}
exports.TokenGenerator = TokenGenerator;
