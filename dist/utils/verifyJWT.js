"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const HttpStatus_1 = require("./HttpStatus");
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        console.log(`Authorization token missing or malformed for path: ${req.originalUrl}`);
        return res.status(HttpStatus_1.HttpStatus.UNAUTHORIZED).json({ message: "Authorization token missing or malformed" });
    }
    const token = authHeader.split(" ")[1];
    console.log(token, "token in header");
    try {
        console.log("Token verification initiated");
        const secret = "helloworld";
        const decoded = jsonwebtoken_1.default.verify(token, secret);
        req.user = decoded;
        console.log("Token verified successfully", decoded);
        next();
    }
    catch (err) {
        console.error(`Token verification failed for path: ${req.originalUrl}`, err);
        if (err.name === "TokenExpiredError") {
            return res.status(HttpStatus_1.HttpStatus.UNAUTHORIZED).json({ message: "Token has expired" });
        }
        else if (err.name === "JsonWebTokenError") {
            return res.status(HttpStatus_1.HttpStatus.UNAUTHORIZED).json({ message: "Invalid token" });
        }
        return res.status(HttpStatus_1.HttpStatus.UNAUTHORIZED).json({ message: "Token verification failed" });
    }
};
exports.default = verifyJWT;
