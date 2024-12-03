// src/types/customRequest.ts
import { Request } from 'express';

// Define a custom Request type that extends the base Express Request interface
export interface CustomRequest extends Request {
  user?: { [key: string]: any }; // You can replace 'any' with your actual User type, e.g., User from your services
}
