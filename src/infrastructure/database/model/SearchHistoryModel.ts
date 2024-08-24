import mongoose, { Schema, Document } from 'mongoose';

interface IProfileSearchHistory extends Document {
  userId: mongoose.Schema.Types.ObjectId;  
  searchedProfileId: mongoose.Schema.Types.ObjectId;  
  timestamp: Date;  
}

// Define the schema for the profile search history
const ProfileSearchHistorySchema: Schema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: true
  },
  searchedProfileId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const ProfileSearchHistoryModel = mongoose.model<IProfileSearchHistory>('ProfileSearchHistory', ProfileSearchHistorySchema);

export default ProfileSearchHistoryModel;
