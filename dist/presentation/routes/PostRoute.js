"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const Stripe = require('stripe');
const stripe = Stripe('sk_test_51PirppRr9XEd7LoYrVRdZGs1hNtVrylVeCidygk60qvoe1h23IPqRE0vDD7Zltc4XuSBLA7jlHofNHyGlnwmzxKP00zS0tmxlX'); // Replace with your Stripe secret key
const router = express_1.default.Router();
// Import media repository, use case, and controller
const PostRepository_1 = require("../../infrastructure/repository/PostRepository");
const PostUseCase_1 = require("../../application/usecase/PostUseCase");
const PostController_1 = require("../controllers/PostController");
const verifyJWT_1 = __importDefault(require("../../utils/verifyJWT"));
// Instantiate the repository, use case, and controller
const repo = new PostRepository_1.MediaRepository();
const mediaUseCase = new PostUseCase_1.MediaUseCase(repo);
const mediaController = new PostController_1.MediaController(mediaUseCase);
// Configure multer for file handling (if needed)
const storage = multer_1.default.memoryStorage();
// router.post('/api/storageMediaInCloud', verifyJWT, upload.array("files"), mediaController.uploadImage.bind(mediaController));
router.post('/api/user/fetchprofile', verifyJWT_1.default, mediaController.visitProfile.bind(mediaController));
router.post('/api/user/followprofile', verifyJWT_1.default, mediaController.followProfile.bind(mediaController));
router.post('/api/user/checkFollowingStatus', verifyJWT_1.default, mediaController.checkFollowingStatus.bind(mediaController));
router.post('/api/user/fetchFeed', verifyJWT_1.default, mediaController.fetchFeed.bind(mediaController));
router.post('/api/user/likepost', verifyJWT_1.default, mediaController.likePost.bind(mediaController));
router.post('/api/user/postComment', verifyJWT_1.default, mediaController.postComment.bind(mediaController));
router.post('/api/user/uploadStory', verifyJWT_1.default, mediaController.uploadStory.bind(mediaController));
router.post('/api/user/updateProfile', verifyJWT_1.default, mediaController.updateProfile.bind(mediaController));
router.post('/api/user/reportPost', verifyJWT_1.default, mediaController.reportPost.bind(mediaController));
router.post('/api/user/fetch-saved-posts', verifyJWT_1.default, mediaController.fetchSavedPosts.bind(mediaController));
router.post('/api/user/updateReadStatus', verifyJWT_1.default, mediaController.updateReadStatus.bind(mediaController));
router.post('/api/user/fetchHistoricalData', verifyJWT_1.default, mediaController.fetchHistoricalData.bind(mediaController));
router.post('/api/user/premiumStatus', mediaController.getPremiumStatus.bind(mediaController));
router.post('/api/user/visitPost', verifyJWT_1.default, mediaController.visitPost.bind(mediaController));
router.post('/api/user/fetchStories', mediaController.fetchStories.bind(mediaController));
router.post('/api/user/upload-audio-cloud', verifyJWT_1.default, mediaController.handleAudioUpload.bind(mediaController));
router.post('/api/media/fetch-notifications', verifyJWT_1.default, mediaController.handleFetchNotifications.bind(mediaController));
router.post('/api/user/savePost', verifyJWT_1.default, mediaController.handleSavePost.bind(mediaController));
router.post('/api/user/expiry-date', mediaController.getExpiryDate.bind(mediaController));
router.get('/api/user/user-demographics', mediaController.getUserDemographics.bind(mediaController));
router.get('/api/admin/chartData1', mediaController.getChartData.bind(mediaController));
router.post('/api/user/fetchChatList', mediaController.getChatList.bind(mediaController));
exports.default = router;
