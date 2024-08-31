import { Schema, model, Document } from 'mongoose';
import { ObjectId } from 'mongodb';

// Interface for the DatingProfile
interface IDatingProfile extends Document {
  userId: ObjectId;
  name: string;
  age: number;
  bio: string;
  images: string[];
  likedUsers: ObjectId[];  // Users that this person has liked
  likedByUsers: ObjectId[]; // Users who have liked this person
}

// Define the schema for the DatingProfile
const DatingProfileSchema = new Schema<IDatingProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: false , default:""},
  age: { type: Number, required: false , default:null},
  bio: { type: String, required: false , default:""},
  images: [{ type: String, default: "" }],
  likedUsers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  likedByUsers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
});

// Create the model from the schema
const DatingProfile = model<IDatingProfile>('DatingProfile', DatingProfileSchema);

export default DatingProfile;
