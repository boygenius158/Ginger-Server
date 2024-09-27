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
import verifyJWT from '../../utils/verifyJWT';
import { PremiumModel } from '../../infrastructure/database/model/PremiumModel';
import Message from '../../infrastructure/database/model/MessageModel';



// Instantiate the repository, use case, and controller
const repo = new MediaRepository();
const mediaUseCase = new MediaUseCase(repo);
const mediaController = new MediaController(mediaUseCase);

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
router.post('/api/user/premiumStatus', verifyJWT, mediaController.getPremiumStatus.bind(mediaController));
router.post('/api/user/visitPost', verifyJWT, mediaController.visitPost.bind(mediaController));
router.post('/api/user/fetchStories', mediaController.fetchStories.bind(mediaController));
router.post('/api/user/upload-audio-cloud', verifyJWT, mediaController.handleAudioUpload.bind(mediaController));
router.post('/api/media/fetch-notifications', verifyJWT, mediaController.handleFetchNotifications.bind(mediaController));
router.post('/api/user/savePost', verifyJWT, mediaController.handleSavePost.bind(mediaController));
router.post('/api/user/expiry-date', mediaController.getExpiryDate.bind(mediaController));
router.get('/api/user/user-demographics', mediaController.getUserDemographics.bind(mediaController));
router.get('/api/admin/chartData1', mediaController.getChartData.bind(mediaController));

router.post('/api/user/fetchChatList',  mediaController.getChatList.bind(mediaController));

//find all
// router.post('/api/user/fetchChatList', async (req, res) => {
//     console.log("zzzzzzz", req.body);
//     const { userId } = req.body
//     const user = await UserModel.findById(userId)
//     if (!user) return
//     const following = user.following || []
//     const followers = user.followers || []
//     const both = [...new Set(followers.concat(following))];
//     console.log(both, "yes the user exist");
//     const users = await UserModel.find({
//         _id: { $in: both }
//     })

//     res.json({ userslist: users })
// })

export default router;










