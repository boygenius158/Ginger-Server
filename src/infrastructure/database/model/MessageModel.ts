import mongoose, { Document, Schema, Model, model } from "mongoose";

// Define the interface for a Message document
interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  receiver: mongoose.Types.ObjectId;
  message: string;
  type: 'text' | 'image' | 'audio';
  timestamp: Date;
  isRead: boolean;
}

// Define the schema for a Message
const messageSchema: Schema<IMessage> = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String, 
    required: true
  },
  type: {
    type: String,
    enum: ['text', 'image','audio'],
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  isRead: {
    type: Boolean,
    default: false
  }
});

// Create and export the Message model
const Message: Model<IMessage> = model<IMessage>('Message', messageSchema);
export default Message;
