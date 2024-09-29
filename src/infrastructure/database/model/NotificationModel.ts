import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
    user: mongoose.Types.ObjectId;
    interactorId: mongoose.Types.ObjectId;
    type: 'like' | 'comment' | 'follow' | 'unfollow';
    message: string;
    createdAt: Date;
}

const NotificationSchema: Schema<INotification> = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        interactorId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['like', 'comment', 'follow','unfollow'],
            required: true,
        },
        message: {
            type: String,
            required: true,
        },

        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
