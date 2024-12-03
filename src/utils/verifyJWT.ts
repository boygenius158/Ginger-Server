import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { HttpStatus } from './HttpStatus';

interface CustomRequest extends Request {
  user?: JwtPayload | string;
}

const verifyJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log(`Authorization token missing or malformed for path: ${req.originalUrl}`);
    return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Authorization token missing or malformed" });
  }

  const token = authHeader.split(" ")[1];
  console.log(token, "token in header");

  try {
    console.log("Token verification initiated");

    const secret = "helloworld"; 
    const decoded = jwt.verify(token, secret) as JwtPayload; 

    req.user = decoded;
    // console.log("Token verified successfully", decoded);

    next();   
  } catch (err: any) {
    console.error(`Token verification failed for path: ${req.originalUrl}`, err);

  
    if (err.name === "TokenExpiredError") {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Invalid token" });
    }

    return res.status(HttpStatus.UNAUTHORIZED).json({ message: "Token verification failed" });
  }
};

export default verifyJWT;
