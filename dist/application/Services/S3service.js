"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const client_s3_1 = require("@aws-sdk/client-s3");
const s3_request_presigner_1 = require("@aws-sdk/s3-request-presigner");
const PostModel_1 = require("../../infrastructure/database/model/PostModel");
const router = express_1.default.Router();
// Initialize S3 Client with credentials from environment variables
const s3 = new client_s3_1.S3Client({
    credentials: {
        secretAccessKey: "zl/TCuzABpntkXgF6x4uZLogHgFIOZ0vmRL9dtUn",
        accessKeyId: "AKIA3FLD5WQRZDJUM334",
    },
    region: "us-east-1",
});
router.post("/api/getPresignedUrls", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { files, caption, userId } = req.body;
    try {
        // Generate presigned URLs for each file
        const presignedUrls = yield Promise.all(files.map((file) => __awaiter(void 0, void 0, void 0, function* () {
            const params = {
                Bucket: 'gingerappbucket1', // Your S3 bucket name
                Key: `${Date.now()}_${file.fileName}`, // Unique file path and name
                ContentType: file.fileType, // File content type
            };
            // Create a command to put the object
            const command = new client_s3_1.PutObjectCommand(params);
            // Generate presigned URL
            const uploadUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 300 }); // URL expires in 5 minutes
            return {
                uploadUrl,
                key: params.Key, // Return the key for potential use (e.g., saving to DB)
            };
        })));
        // Construct the public object URLs for later use
        const imageUrls = presignedUrls.map(urlInfo => `https://gingerappbucket1.s3.amazonaws.com/${urlInfo.key}`);
        // Create a new post object
        const newPost = new PostModel_1.PostModel({
            imageUrl: imageUrls,
            caption,
            userId,
        });
        // Save the post to the database
        yield newPost.save();
        console.log(presignedUrls);
        // Return the generated presigned URLs and the post ID
        return res.json({ presignedUrls, postId: newPost._id });
    }
    catch (error) {
        console.error("Error generating presigned URLs or saving post:", error);
        return res.status(500).json({ message: "Error processing your request" });
    }
}));
exports.default = router;
