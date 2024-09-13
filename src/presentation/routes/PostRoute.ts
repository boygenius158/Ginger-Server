import express from 'express';
import multer from 'multer';
const Stripe = require('stripe');

const stripe = Stripe('sk_test_51PirppRr9XEd7LoYrVRdZGs1hNtVrylVeCidygk60qvoe1h23IPqRE0vDD7Zltc4XuSBLA7jlHofNHyGlnwmzxKP00zS0tmxlX'); // Replace with your Stripe secret key

const router = express.Router();

// Import media repository, use case, and controller
import { MediaRepository } from '../../infrastructure/repository/PostRepository';
import { MediaUseCase } from '../../application/usecase/PostUseCase';
import { MediaController } from '../controllers/PostController';
import UserModel, { IUser } from '../../infrastructure/database/model/UserModel';
import upload from '../../infrastructure/middleware/fileUpload';

import { UserRole } from '../../domain/entities/User';



// Instantiate the repository, use case, and controller
const repo = new MediaRepository();
const mediaUseCase = new MediaUseCase(repo);
const mediaController = new MediaController(mediaUseCase);

// Configure multer for file handling (if needed)
const storage = multer.memoryStorage();

// Define the POST route for uploading media to the cloud
// router.post('/storageMediaInCloud', uploadMiddleWare.single('file'), controller.uploadImage.bind(controller));
router.post('/api/storageMediaInCloud', upload.array("files"), mediaController.uploadImage.bind(mediaController));
router.post('/api/user/fetchprofile', mediaController.visitProfile.bind(mediaController));
router.post('/api/user/followprofile', mediaController.followProfile.bind(mediaController))
router.post('/api/user/checkFollowingStatus', mediaController.checkFollowingStatus.bind(mediaController))
router.post('/api/user/fetchFeed', mediaController.fetchFeed.bind(mediaController))
router.post('/api/user/likepost', mediaController.likePost.bind(mediaController))


router.post('/api/user/postComment', mediaController.postComment.bind(mediaController))
router.post('/api/user/uploadStory', mediaController.uploadStory.bind(mediaController))
router.post('/api/user/updateProfile', mediaController.updateProfile.bind(mediaController))
router.post('/api/user/reportPost', mediaController.reportPost.bind(mediaController));
router.post('/api/user/fetch-saved-posts', mediaController.fetchSavedPosts.bind(mediaController));
router.post('/api/user/updateReadStatus', mediaController.updateReadStatus.bind(mediaController));
router.post('/api/user/fetchHistoricalData', mediaController.fetchHistoricalData.bind(mediaController));
router.post('/api/user/premiumStatus', mediaController.getPremiumStatus.bind(mediaController));
router.post('/api/user/fetchChatList', mediaController.getChatList.bind(mediaController));
router.post('/api/user/visitPost', mediaController.visitPost.bind(mediaController));
router.post('/api/user/fetchStories', mediaController.fetchStories.bind(mediaController));
router.post('/api/user/upload-audio-cloud', mediaController.handleAudioUpload.bind(mediaController));
router.post('/api/media/fetch-notifications', mediaController.handleFetchNotifications.bind(mediaController));
router.post('/api/user/savePost', mediaController.handleSavePost.bind(mediaController));



export default router;










