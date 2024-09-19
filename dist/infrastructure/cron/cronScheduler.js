"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cronTask_1 = __importDefault(require("./tasks/cronTask"));
const cron = require('node-cron');
function scheduleCronJobs() {
    // Schedule task to run every 24 hours at midnight
    cron.schedule('0 0 * * *', cronTask_1.default);
    console.log('Cron jobs scheduled successfully.');
}
// Export the function
exports.default = scheduleCronJobs;
