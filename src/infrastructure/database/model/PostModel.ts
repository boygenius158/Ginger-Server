import mongoose, { Schema, Document } from 'mongoose';

// Define interface for Post
export interface Post extends Document {
  // _id:mongoose.Types.ObjectId;
  imageUrl: string;
  caption: string;
  userId: mongoose.Types.ObjectId
  likeCount?: number,
  likes?: mongoose.Types.ObjectId[],
  isReported?: mongoose.Types.ObjectId[],
  isActive?: boolean
  createdAt?: Date;
  isBanned?:boolean
}

// Define schema for Post
const PostSchema: Schema<Post> = new Schema({
  imageUrl:[{ type: String, required: true }],
  caption: { type: String, required: false , default : "" },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likeCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  isReported: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
  isBanned: { type: Boolean, default: false }
});

// Define and export Mongoose model
export const PostModel = mongoose.model<Post>('Post', PostSchema);
