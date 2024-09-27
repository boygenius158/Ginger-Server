"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const User_1 = require("../../../domain/entities/User");
// Define the User schema
const UserSchema = new mongoose_1.Schema({
    email: { type: String, required: true },
    password: { type: String, default: null },
    name: { type: String, default: "" },
    profilePicture: { type: String, default: "https://i.pinimg.com/564x/c9/3c/07/c93c07197a6b5e995b4da0de2f2de90a.jpg" },
    username: { type: String, default: "" },
    roles: { type: String, enum: Object.values(User_1.UserRole), default: User_1.UserRole.User },
    bio: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    following: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: [] }],
    followers: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: [] }],
    savedPosts: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User', default: [] }],
    isBlocked: { type: Boolean, default: false }
});
// Create the User model
const UserModel = mongoose_1.default.model('User', UserSchema);
exports.default = UserModel;
