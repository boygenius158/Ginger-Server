import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../../../domain/entities/User';

// Define the IUser interface extending Document
export interface IUser extends Document {
    _id: mongoose.Types.ObjectId; // Add _id field here
    email: string;
    password: string;
    name?: string;
    profilePicture?: string,
    username?: string;
    roles?: UserRole;
    bio?: string;
    isVerified: boolean;
    otp?: string | null;
    following?: mongoose.Types.ObjectId[]
    followers?: mongoose.Types.ObjectId[]
    savedPosts?: mongoose.Types.ObjectId[]
    isBlocked?: boolean
}


// Define the User schema
const UserSchema: Schema<IUser> = new Schema({
    email: { type: String, required: true },
    password: { type: String, default: null },
    name: { type: String, default: "" },
    profilePicture: { type: String, default: "" },
    username: { type: String, default: "" },
    roles: { type: String, enum: Object.values(UserRole), default: UserRole.User },
    bio: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    savedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] }],
    isBlocked: { type: Boolean, default: false }

});

// Create the User model
const UserModel = mongoose.model<IUser>('User', UserSchema);
export default UserModel;
 