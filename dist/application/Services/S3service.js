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
const HttpStatus_1 = require("../../utils/HttpStatus");
const jwt = require("jsonwebtoken");
const router = express_1.default.Router();
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
                Bucket: 'gingerappbucket1',
                Key: `${Date.now()}_${file.fileName}`,
                ContentType: file.fileType,
            };
            const command = new client_s3_1.PutObjectCommand(params);
            const uploadUrl = yield (0, s3_request_presigner_1.getSignedUrl)(s3, command, { expiresIn: 300 }); // URL expires in 5 minutes
            return {
                uploadUrl,
                key: params.Key,
            };
        })));
        const imageUrls = presignedUrls.map(urlInfo => `https://gingerappbucket1.s3.amazonaws.com/${urlInfo.key}`);
        const newPost = new PostModel_1.PostModel({
            imageUrl: imageUrls,
            caption,
            userId,
        });
        yield newPost.save();
        const aggregatedPost = yield PostModel_1.PostModel.aggregate([
            { $match: { _id: newPost._id } },
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails',
                },
            },
            {
                $unwind: '$userDetails',
            },
            {
                $project: {
                    _id: 1,
                    imageUrl: 1,
                    caption: 1,
                    'userDetails.username': 1,
                    'userDetails.name': 1,
                    'userDetails.profilePicture': 1,
                    'userDetails.followers': 1,
                    'userDetails.following': 1,
                },
            },
        ]);
        if (aggregatedPost.length === 0)
            return res.status(HttpStatus_1.HttpStatus.NOT_FOUND).json({ message: "Post not found" });
        const responseData = {
            presignedUrls,
            post: aggregatedPost[0],
        };
        return res.json(responseData);
    }
    catch (error) {
        console.error("Error generating presigned URLs or saving post:", error);
        return res.status(HttpStatus_1.HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error processing your request" });
    }
}));
router.post("/refresh-token", (req, res) => {
    const { refreshToken } = req.body;
    // Validate refresh token
    jwt.verify(refreshToken, "helloworld", (err, user) => {
        if (err)
            return res.status(403).json({ message: "Invalid refresh token" });
        // Generate new access token
        const newAccessToken = jwt.sign({ id: user.id, roles: user.roles }, "helloworld", { expiresIn: "30m" } // Extend token expiration as needed
        );
        res.json({ accessToken: newAccessToken });
    });
});
// router.post('/api/user/profile-completion-status', async (req, res) => {
//     const userId = req.body.userId;
//     try {
//         const profile = await DatingProfile.findOne({ userId });
//         if (!profile) {
//             return res.status(404).json({ error: "Profile not found" });
//         }
//         // Using <any> to bypass TypeScript's strict property checks
//         const requiredFields = ["name", "age", "bio", "images", "gender", "profileVisibility", "maximumAge", "interestedGender"];
//         const isProfileComplete = requiredFields.every(field => {
//             const value = (profile as any)[field];
//             return value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0) && value !== '';
//         });
//         res.json({
//             profile,
//             isProfileComplete
//         });
//     } catch (error) {
//         console.error("Error fetching profile:", error);
//         res.status(500).json({ error: "Server error" });
//     }
// });
exports.default = router;
