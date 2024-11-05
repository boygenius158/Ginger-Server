"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Define the schema for the DatingProfile
const DatingProfileSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: false, default: "" },
    age: { type: Number, required: false, default: null },
    bio: { type: String, required: false, default: "" },
    images: [{ type: String, default: "" }],
    likedUsers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: [] }],
    likedByUsers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User', default: [] }],
    gender: { type: String, required: false, default: "" }, // Add gender field
    profileVisibility: { type: Boolean, default: false }, // Add profileVisibility field
    maximumAge: { type: Number, required: false, default: "" }, // Add maximumAge field
    interestedGender: { type: String, required: false, default: "" }, // Add interestedGender field
});
// Create the model from the schema
const DatingProfile = (0, mongoose_1.model)('DatingProfile', DatingProfileSchema);
exports.default = DatingProfile;
