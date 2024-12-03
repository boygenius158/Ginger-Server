import { createLogger, format, transports } from 'winston';
import 'winston-daily-rotate-file';

// Define a daily rotate file transport
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: 'logs/%DATE%-combined.log', // Logs will be stored in a 'logs/' folder
  datePattern: 'YYYY-MM-DD',           // Rotate logs daily
  zippedArchive: true,                 // Compress older logs
  maxSize: '20m',                      // Maximum size per log file
  maxFiles: '14d',                     // Retain logs for 14 days
});

// Create the logger instance
const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new transports.Console(),          // Log to console
    dailyRotateFileTransport           // Log to daily rotated files
  ]
});

export default logger;
