"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Create a Schema corresponding to the document interface
const reportSchema = new mongoose_1.Schema({
    reporterId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Post', required: true },
    actionTaken: { type: Boolean, default: false }, // Default is false, meaning no action taken yet
    createdAt: { type: Date, default: Date.now },
});
// Create a Model
const Report = (0, mongoose_1.model)('Report', reportSchema);
exports.default = Report;
