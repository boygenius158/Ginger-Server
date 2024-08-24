import mongoose, { Schema, Document } from "mongoose";

// Define the Premium interface extending Document
export interface Premium extends Document {
    userId: mongoose.Types.ObjectId;
    amount: number;
    createdAt?: Date;  // Optional fields added by timestamps
    updatedAt?: Date;
}

const PremiumSchema: Schema<Premium> = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true }
}, {
    timestamps: true // Add timestamps option here
});

// Create and export the Premium model
export const PremiumModel = mongoose.model<Premium>('Premium', PremiumSchema);
