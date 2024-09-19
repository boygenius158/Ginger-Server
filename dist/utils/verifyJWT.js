"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log(`Authorization token missing or malformed for path: ${req.originalUrl}`);
        return res.status(401).json({ message: "Authorization token missing or malformed" });
    }
    const token = authHeader.split(" ")[1]; // Extract the token after "Bearer"
    try {
        console.log("Token verification initiated");
        const decoded = jsonwebtoken_1.default.verify(token, process.env.NEXTAUTH_SECRET); // Verify the token
        req.user = decoded; // Attach the decoded token to the request
        next(); // Continue to the next middleware or route handler
    }
    catch (err) {
        console.error(`Token verification failed for path: ${req.originalUrl}`, err);
        return res.status(403).json({ message: "Invalid token" });
    }
};
exports.default = verifyJWT;
