import mongoose, { Schema, Document } from "mongoose";


const ReplySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
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


export interface Comment extends Document {
  userId?: mongoose.Types.ObjectId;
  postId?: mongoose.Types.ObjectId;
  content: string;
  replies: Array<{
    userId: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
  }>;
  createdAt?: Date;
}


const CommentSchema: Schema<Comment> = new Schema({
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
  content: {
    type: String,
    required: true
  },
  
  replies: [ReplySchema], 

  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Comment model
const CommentModel = mongoose.model<Comment>('Comment', CommentSchema);
export default CommentModel;
