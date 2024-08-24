import mongoose, { Document, Schema } from 'mongoose';

interface IStory extends Document {
  userId: mongoose.Types.ObjectId;
  imageUrl: string;
  createdAt?: Date;
}

const storySchema = new Schema<IStory>({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '24h',
  },
});

const StoryModel = mongoose.model<IStory>('Story', storySchema);

export default StoryModel;
