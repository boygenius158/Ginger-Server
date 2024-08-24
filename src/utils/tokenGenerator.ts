// tokenGenerator.ts
const jwt = require('jsonwebtoken')

export class TokenGenerator {
   generateToken(payload: any, secretKey: string, expiresIn: string): string {
    return jwt.sign(payload, secretKey, { expiresIn });
  }

   verifyToken(token: string, secretKey: string): any {
    try {
      return jwt.verify(token, secretKey);
    } catch (error) {
      console.error('Error verifying token:', error);
      return null;
    }
  }
}
