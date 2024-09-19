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
    profilePicture: { type: String, default: "https://instagram.fhyd14-1.fna.fbcdn.net/v/t51.2885-19/44884218_345707102882519_2446069589734326272_n.jpg?_nc_ht=instagram.fhyd14-1.fna.fbcdn.net&_nc_cat=1&_nc_ohc=cXqyMerIMHAQ7kNvgFNYC7q&edm=AHBgTAQBAAAA&ccb=7-5&ig_cache_key=YW5vbnltb3VzX3Byb2ZpbGVfcGlj.2-ccb7-5&oh=00_AYCTxqKdtDsgyzMlJw6nRF9R1G5OaVRA0O8liXsbuWJlNg&oe=66A84C8F&_nc_sid=21e75c" },
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
