import { Schema, model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

// Interface for the DatingProfile
interface IDatingProfile extends Document {
  userId: ObjectId;
  name: string;
  age: number;
  bio: string;
  images: string[];
}

// Define the schema for the DatingProfile
const DatingProfileSchema = new Schema<IDatingProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  age: { type: Number, required: true },
  bio: { type: String, required: true },
  images: { type: [String], default: [] }
});

// Create the model from the schema
const DatingProfile = model<IDatingProfile>('DatingProfile', DatingProfileSchema);

export default DatingProfile;
