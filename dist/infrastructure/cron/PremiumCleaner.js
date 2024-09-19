"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cleanupExpiredDocuments_1 = __importDefault(require("./tasks/cleanupExpiredDocuments"));
const cron = require('node-cron');
function scheduleDelete() {
    cron.schedule('0 0 * * *', cleanupExpiredDocuments_1.default);
    console.log('running premium expired cleaner');
}
exports.default = scheduleDelete;
