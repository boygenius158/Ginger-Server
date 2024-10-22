"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// logger.ts
const winston_1 = require("winston");
const logger = (0, winston_1.createLogger)({
    format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.printf(({ timestamp, level, message }) => {
        return `${timestamp} ${level}: ${message}`;
    })),
    transports: [
        new winston_1.transports.Console(),
        new winston_1.transports.File({ filename: 'combined.log' })
    ]
});
exports.default = logger;
