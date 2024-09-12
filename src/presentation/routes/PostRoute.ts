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
router.post('/storageMediaInCloud', upload.array("files"), mediaController.uploadImage.bind(mediaController));
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


// router.post('/create-payment-intent', async (req, res) => {
//     console.log("Payment intent endpoint HIT", req.body);

//     const { amount, userId, currency = 'usd' } = req.body; // Default to 'usd' if currency is not provided

//     try {
//         const paymentIntent = await stripe.paymentIntents.create({
//             amount, // Amount in the smallest currency unit (e.g., cents)
//             currency, // Currency (e.g., 'usd')
//         });

//         res.send({
//             clientSecret: paymentIntent.client_secret,
//         });

//         const user = await UserModel.findById(userId)
//         console.log(user);
//         if (!user) {
//             return
//         }
//         user.roles = UserRole.Premium
//         await user.save()

//     } catch (error) {
//         console.log(error, "error");

//         res.status(400).send({});
//     }
// });

export default router;





// router.post('/api/user/savePost', async (req, res) => {
//     // console.log("save post", req.body);

//     try {

//         const objectId = new mongoose.Types.ObjectId(req.body.postId)
//         const user = await UserModel.findById(req.body.userId)
//         // console.log(user);
//         if (!user) {
//             return
//         }

//         if (!user.savedPosts) {
//             user.savedPosts = []
//         }

//         const postIndex = user.savedPosts.indexOf(objectId)

//         if (postIndex === -1) {
//             user.savedPosts.push(objectId)
//         } else {
//             user.savedPosts.splice(postIndex, 1)
//         }

//         await user.save()


//         res.json({ message: "Post saved/unsaved successfully" });

//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "An error occurred" });
//     }



// })


// router.post('/api/user/premiumStatus', async (req, res) => {
//     const user = await UserModel.findById(req.body.userId)
//     if (!user) {
//         return
//     }
//     console.log(user.roles);

//     const role = user.roles

//     res.json({ role })
//     console.log("premium status ", req.body);

// })


// router.post('/api/user/fetchHistoricalData', async (req, res) => {
//     // console.log("fetchHistoricalData() hit", req.body);
//     const { senderId, receiverId } = req.body
//     const messages = await Message.find({
//         $or: [
//             { sender: senderId, receiver: receiverId },
//             { sender: receiverId, receiver: senderId },
//         ]
//     }).sort({ timestamp: 1 })

//     // console.log(messages);


//     res.json({ messages })

// })

// router.post('/api/user/fetchChatList', async (req, res) => {
//     try {
//         const { userId } = req.body;
//         if (!userId) {
//             return res.status(400).json({ error: 'User ID is required' });
//         }

//         const user = await UserModel.findById(userId);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const following = user.following || [];
//         const followingUsers = await UserModel.find({ _id: { $in: following } });

//         res.json({ followingUsers });
//     } catch (error) {
//         console.error('Error fetching chat list:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// });

// router.post('/api/user/fetch-saved-posts', async (req, res) => {
//     try {
//         const { username } = req.body;

//         // Find the user by username
//         const user = await UserModel.findOne({ username: username })
//         console.log(user?.savedPosts);
//         const savedPostId = user?.savedPosts

//         const posts = await PostModel.find({
//             _id: { $in: savedPostId }
//         });

//         console.log(posts, "poiu");


//         if (!user) {
//             return res.status(400).json({ error: 'User not found' });
//         }

//         // If user is found, return the saved posts
//         return res.status(200).json({ savedPosts: posts });
//     } catch (error) {
//         console.error('Error fetching saved posts:', error);
//         return res.status(500).json({ error: 'Server error' });
//     }
// });


// router.post('/api/user/updateReadStatus', async (req, res) => {
//     console.log("update read status", req.body);
//     const { sender, recipient } = req.body
//     const messages = await Message.updateMany(
//         {
//             $or: [
//                 // { sender: sender, receiver: recipient },
//                 { sender: recipient, receiver: sender },
//             ],
//             isRead: false
//         },
//         {
//             $set: { isRead: true }
//         })
//     res.json({ messages })

// })
// router.post('/api/user/uploadProfile', async (req, res) => {
//     console.log("profile has been uploaded", req.body);
//     const { url, userId } = req.body
//     console.log(req.body.userId);
//     const objectId = new mongoose.Types.ObjectId(userId)
//     const user = await UserModel.findById(objectId)
//     if (!user) {
//         return res.status(404).json({ error: "user not found" })
//     }
//     user.profilePicture = url
//     await user.save()
//     res.json({ url })

// })
// router.post('/api/user/fetchStories', async (req, res) => {
//     try {
//         const { userId } = req.body;

//         const user = await UserModel.findById(userId).select('following');
//         if (!user) {
//             return res.status(404).json({ message: 'User not found' });
//         }

//         const followingList = user.following || [];

//         const stories = await StoryModel.aggregate([
//             { $match: { userId: { $in: followingList } } },
//             {
//                 $lookup: {
//                     from: 'users',
//                     localField: 'userId',
//                     foreignField: '_id',
//                     as: 'userDetails'
//                 }
//             },
//             { $unwind: '$userDetails' },
//             {
//                 $project: {
//                     _id: 1,
//                     userId: 1,
//                     imageUrl: 1,
//                     createdAt: 1,
//                     'userDetails.username': 1,
//                     'userDetails.profilePicture': 1
//                 }
//             }
//         ]);

//         return res.json({ stories });
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ message: 'Internal server error' });
//     }
// });
// router.post('/api/user/visitPost', async (req, res) => {
//     console.log("visit post", req.body);
//     const idPost = new mongoose.Types.ObjectId(req.body.postId)
//     const result = await PostModel.findById(req.body.postId).populate('userId')
//     const comments = await CommentModel.find({ postId: idPost }).populate('userId')

//     console.log(result, "result");

//     res.json({ result, comments })


// })
// router.post('/api/user/dating-tab2', async (req, res) => {
//     console.log("dating tab2", req.body);
//     const user = await DatingProfile.findOne({ userId: req.body.userId })
//     if (!user) {
//         return
//     }
//     user.images = req.body.url
//     await user.save()
//     console.log(user);

//     res.json({})

// })
// router.post('/api/user/dating-tab1', async (req, res) => {
//     try {
//         console.log("dating tab-1", req.body);

//         // Find the user by email (assuming email is unique)
//         const user = await DatingProfile.findOne({ userId: req.body.userId });

//         if (user) {
//             console.log("already exists");

//             const updatedProfile = await DatingProfile.updateOne(
//                 { userId: req.body.userId },
//                 {
//                     $set: {
//                         name: req.body.formData.name,
//                         age: req.body.formData.age,
//                         bio: req.body.formData.bio,
//                         gender: req.body.formData.gender
//                     }
//                 }
//             );

//             res.json({ updatedProfile });

//         } else {
//             console.log("create new");

//             // Create a new profile if none exists
//             const profile = new DatingProfile({
//                 userId: req.body.userId,
//                 name: req.body.formData.name,
//                 age: req.body.formData.age,
//                 bio: req.body.formData.bio,
//                 gender: req.body.formData.gender
//             });
//             await profile.save();
//             res.json({ profile });

//         }

//         // res.json({ success: true });
//     } catch (error) {
//         console.error("Error handling dating profile:", error);
//         res.status(500).json({ error: "An error occurred while processing your request." });
//     }
// });
// router.post('/api/user/dating-tab3', async (req, res) => {
//     const user = await DatingProfile.findOne({ userId: req.body.userId })
//     if (!user) {
//         console.log("user not found");

//         return
//     }
//     res.json({ images: user.images })

// })
// router.post('/api/user/dating-tab4', async (req, res) => {
//     console.log(req.body, "lol");
//     const user = await DatingProfile.findOne({ userId: req.body.userId })
//     if (!user) {
//         throw new Error
//     }
//     user.maximumAge = req.body.maximumAge,
//         user.profileVisibility = req.body.profileVisibility
//     await user.save()
//     console.log(user, ".:po098");


// })

// router.post('/api/user/settings', async (req, res) => {
//     try {
//         const { userId } = req.body;

//         // Validate that userId is provided
//         if (!userId) {
//             return res.status(400).json({ error: 'User ID is required' });
//         }

//         // Fetch user settings from the database
//         const user = await DatingProfile.findOne({ userId });

//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         const data = {
//             maximumAge: user.maximumAge || 18, // Default values if data is missing
//             profileVisibility: user.profileVisibility || false,
//             gender: user.gender || 'not specified'
//         };

//         return res.status(200).json({ data });
//     } catch (error) {
//         console.error('Error fetching user settings:', error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// });

// router.post('/api/user/dating-tab1-getdetails', async (req, res) => {
//     console.log(req.body, "=-0098");
//     const user = await DatingProfile.findOne({ userId: req.body.userId })
//     // console.log(user);
//     const formData = {
//         name: user?.name,
//         age: user?.age,
//         bio: user?.bio,
//         gender: user?.gender
//     }
//     res.json({ formData })

// })

// router.post('/api/user/reportPost', async (req, res) => {
//     console.log("report post is hit", req.body);
//     const report = new Report({
//         reporterId: req.body.victimUser,
//         postId: req.body.postId,
//     })
//     await report.save()
//     res.json({})


// })
// router.post('/api/user/sendImageInChat', async (req, res) => {
//     console.log("sendImageInChat", req.body);
//     res.json({})

// })
// router.post('/api/user/upload-audio-cloud', async (req, res) => {
//     console.log("audio-cloud", req.body.audio_url.url);
//     const schema = new Message({
//         sender: req.body.sender,
//         receiver: req.body.receiverId,
//         message: req.body.audio_url.url,
//         type: "audio"
//     })
//     await schema.save()
//     res.json({})
// })



// router.post('/api/media/fetch-notifications', async (req, res) => {
//     console.log("fetch notifications", req.body);
//     // const notifications = await Notification.find({userId:req.body.userId})
//     const notifications = await Notification.find({ user: req.body.userId })
//         .populate('interactorId', 'username profilePicture') // Populate interactorId with specific fields
//         .exec();
//     console.log(notifications, "notifications");
//     res.json({ notifications })


// })
