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
    profilePicture: { type: String, default: "https://instagram.fhyd14-1.fna.fbcdn.net/v/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fhyd14-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=cXqyMerIMHAQ7kNvgFNYC7q&edm=AHBgTAQBAAAA&ccb=7-5&ig_cache_key=YW5vbnltb3VzX3Byb2ZpbGVfcGlj.2-ccb7-5&oh=00_AYCTxqKdtDsgyzMlJw6nRF9R1G5OaVRA0O8liXsbuWJlNg&oe=66A84C8F&_nc_sid=21e75c" },
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
 