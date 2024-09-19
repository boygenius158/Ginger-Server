import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface CustomRequest extends Request {
    user?: string | JwtPayload; // Adding the decoded user payload to the request
}

const verifyJWT = (req: CustomRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log(`Authorization token missing or malformed for path: ${req.originalUrl}`);
        return res.status(401).json({ message: "Authorization token missing or malformed" });
    }

    const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"

    try {
        console.log("Token verification initiated");

        const decoded = jwt.verify(token, process.env.NEXTAUTH_SECRET as string); // Verify the token
        req.user = decoded; // Attach the decoded token to the request

        next(); // Continue to the next middleware or route handler
    } catch (err) {
        console.error(`Token verification failed for path: ${req.originalUrl}`, err);
        return res.status(403).json({ message: "Invalid token" });
    }
};


export default verifyJWT;
