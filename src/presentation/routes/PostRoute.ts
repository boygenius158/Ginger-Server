import express from 'express';
import multer from 'multer';
const Stripe = require('stripe');

const stripe = Stripe('sk_test_51PirppRr9XEd7LoYrVRdZGs1hNtVrylVeCidygk60qvoe1h23IPqRE0vDD7Zltc4XuSBLA7jlHofNHyGlnwmzxKP00zS0tmxlX'); // Replace with your Stripe secret key

const router = express.Router();


// Import media repository, use case, and controller
import { PostRepository } from '../../infrastructure/repository/PostRepository';
import { PostUseCase } from '../../application/usecase/PostUseCase';
import { PostController } from '../controllers/PostController';

import verifyJWT from '../../utils/verifyJWT';



// Instantiate the repository, use case, and controller
const repo = new PostRepository();
const mediaUseCase = new PostUseCase(repo);
const mediaController = new PostController(mediaUseCase);

// Configure multer for file handling (if needed)
const storage = multer.memoryStorage();







// router.post('/api/storageMediaInCloud', verifyJWT, upload.array("files"), mediaController.uploadImage.bind(mediaController));
router.post('/api/user/fetchprofile', verifyJWT, mediaController.visitProfile.bind(mediaController));
router.post('/api/user/followprofile', verifyJWT, mediaController.followProfile.bind(mediaController));
router.post('/api/user/checkFollowingStatus', verifyJWT, mediaController.checkFollowingStatus.bind(mediaController));
router.post('/api/user/fetchFeed', verifyJWT, mediaController.fetchFeed.bind(mediaController));
router.post('/api/user/likepost', verifyJWT, mediaController.likePost.bind(mediaController));
router.post('/api/user/postComment', verifyJWT, mediaController.postComment.bind(mediaController));
router.post('/api/user/uploadStory', verifyJWT, mediaController.uploadStory.bind(mediaController));
router.post('/api/user/updateProfile', verifyJWT, mediaController.updateProfile.bind(mediaController));
router.post('/api/user/reportPost', verifyJWT, mediaController.reportPost.bind(mediaController));
router.post('/api/user/fetch-saved-posts', verifyJWT, mediaController.fetchSavedPosts.bind(mediaController));
router.post('/api/user/updateReadStatus', verifyJWT, mediaController.updateReadStatus.bind(mediaController));
router.post('/api/user/fetchHistoricalData', verifyJWT, mediaController.fetchHistoricalData.bind(mediaController));
router.post('/api/user/premiumStatus',  mediaController.getPremiumStatus.bind(mediaController));
router.post('/api/user/visitPost', verifyJWT, mediaController.visitPost.bind(mediaController));
router.post('/api/user/fetchStories', mediaController.fetchStories.bind(mediaController));
router.post('/api/user/upload-audio-cloud', verifyJWT, mediaController.handleAudioUpload.bind(mediaController));
router.post('/api/media/fetch-notifications', verifyJWT, mediaController.handleFetchNotifications.bind(mediaController));
router.post('/api/user/savePost', verifyJWT, mediaController.handleSavePost.bind(mediaController));
router.post('/api/user/expiry-date', mediaController.getExpiryDate.bind(mediaController));
router.get('/api/user/user-demographics', mediaController.getUserDemographics.bind(mediaController));
router.get('/api/admin/chartData1', mediaController.getChartData.bind(mediaController));
router.post('/api/user/fetchChatList',  mediaController.getChatList.bind(mediaController));
// router.post('/api/user/user-posted-reply',mediaController.userPostedReply.bind(mediaController))



export default router;










