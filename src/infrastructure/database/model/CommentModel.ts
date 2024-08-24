import mongoose, { Schema, Document } from "mongoose";

export interface Comment extends Document {
    userId?: mongoose.Types.ObjectId;
    postId?: mongoose.Types.ObjectId;
    content: string;
    createdAt?: Date;
}

const CommentSchema: Schema<Comment> = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        // required: true,
        ref: 'User'
    },
    postId: {
        type: Schema.Types.ObjectId,
        // required: true,
        ref: 'Post'
    },
    content: {
        type: String,
        // required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const CommentModel = mongoose.model<Comment>('Comment', CommentSchema);
export default CommentModel;
