import { Schema, model, Document, Types } from 'mongoose';

// Define an interface representing a document in MongoDB
export interface IFCMToken extends Document {
  userId: Types.ObjectId;  // Reference to the User model
  token: string;           // FCM token string
  createdAt: Date;         // Timestamp when the token was created
}

// Create a Schema corresponding to the document interface
const FCMTokenSchema = new Schema<IFCMToken>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

// Create a Model
const FCMToken = model<IFCMToken>('FCMToken', FCMTokenSchema);

export default FCMToken;
     