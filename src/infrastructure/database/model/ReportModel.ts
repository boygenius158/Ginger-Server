import { Schema, model, Document, Types } from 'mongoose';

// Define an interface representing a document in MongoDB
interface IReport extends Document {
  reporterId: Types.ObjectId;
  postId: Types.ObjectId;
  actionTaken: boolean; // Field to check whether admin has taken action
  createdAt: Date;
}

// Create a Schema corresponding to the document interface
const reportSchema = new Schema<IReport>({
  reporterId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  postId: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
  actionTaken: { type: Boolean, default: false }, // Default is false, meaning no action taken yet
  createdAt: { type: Date, default: Date.now },
});

// Create a Model
const Report = model<IReport>('Report', reportSchema);

export default Report;
