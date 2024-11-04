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
  gender?: string; // Add gender
  profileVisibility?: boolean; // Add profile visibility
  maximumAge?: number; // Add maximum age
  interestedGender?: string; // Add interested gender
}


// Define the schema for the DatingProfile
const DatingProfileSchema = new Schema<IDatingProfile>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: false, default: "" },
  age: { type: Number, required: false, default: null },
  bio: { type: String, required: false, default: "" },
  images: [{ type: String, default: "" }],
  likedUsers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  likedByUsers: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
  gender: { type: String, required: false , default:"" }, // Add gender field
  profileVisibility: { type: Boolean, default: false }, // Add profileVisibility field
  maximumAge: { type: Number, required: false , default:""}, // Add maximumAge field
  interestedGender: { type: String, required: false, default:"" }, // Add interestedGender field
});

// Create the model from the schema
const DatingProfile = model<IDatingProfile>('DatingProfile', DatingProfileSchema);

export default DatingProfile;
