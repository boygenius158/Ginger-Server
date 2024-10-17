import mongoose, { Schema, Document } from "mongoose";

interface Reply extends Document {
  userId: mongoose.Types.ObjectId;
  parentId: mongoose.Types.ObjectId;
  postId: mongoose.Types.ObjectId;
  content: string
  createdAt: Date

}

const ReplySchema: Schema<Reply> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true 
  },
  parentId: {
    type: Schema.Types.ObjectId,
    ref: 'Comment',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ReplyModel = mongoose.model<Reply>('Reply', ReplySchema)
export default ReplyModel