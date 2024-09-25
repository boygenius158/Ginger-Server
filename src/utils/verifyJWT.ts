import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: JwtPayload | string; // Attach the decoded payload (it can be string or object)
}

const verifyJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log(`Authorization token missing or malformed for path: ${req.originalUrl}`);
    return res.status(401).json({ message: "Authorization token missing or malformed" });
  }

  const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"
  console.log(token, "token in header");

  try {
    console.log("Token verification initiated");

    // Use process.env.JWT_SECRET for security instead of hardcoding
    const secret = "helloworld"; // Use env or fallback
    const decoded = jwt.verify(token, secret) as JwtPayload; // Decode and verify token

    // Attach decoded user info to the request object
    req.user = decoded;
    console.log("Token verified successfully", decoded);

    next(); // Proceed to next middleware or route
  } catch (err: any) {
    console.error(`Token verification failed for path: ${req.originalUrl}`, err);

    // Handle specific JWT errors (like token expiration)
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(401).json({ message: "Token verification failed" });
  }
};

export default verifyJWT;
