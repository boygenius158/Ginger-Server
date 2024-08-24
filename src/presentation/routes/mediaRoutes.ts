import express from 'express';
import multer from 'multer';
const Stripe = require('stripe');

const stripe = Stripe('sk_test_51PirppRr9XEd7LoYrVRdZGs1hNtVrylVeCidygk60qvoe1h23IPqRE0vDD7Zltc4XuSBLA7jlHofNHyGlnwmzxKP00zS0tmxlX'); // Replace with your Stripe secret key

const router = express.Router();

// Import media repository, use case, and controller
import { MediaRepository } from '../../infrastructure/repository/mediaRepository';
import { MediaUseCase } from '../../application/usecase/mediaUseCase';
import { MediaController } from '../controllers/mediaController';
import CommentModel from '../../infrastructure/database/model/CommentModel';
import UserModel, { IUser } from '../../infrastructure/database/model/authModel';
import { PostModel } from '../../infrastructure/database/model/PostModel';
import upload from '../../infrastructure/middleware/fileUpload';
import StoryModel from '../../infrastructure/database/model/StoryModel';
import Message from '../../infrastructure/database/model/MessageModel';
import mongoose from 'mongoose';
import { UserRole } from '../../domain/entities/User';
import { Notification } from '../../infrastructure/database/model/NotificationModel';



// Instantiate the repository, use case, and controller
const repo = new MediaRepository();
const mediaUseCase = new MediaUseCase(repo);
const controller = new MediaController(mediaUseCase);

// Configure multer for file handling (if needed)
const storage = multer.memoryStorage();

// Define the POST route for uploading media to the cloud
// router.post('/storageMediaInCloud', uploadMiddleWare.single('file'), controller.uploadImage.bind(controller));
router.post('/storageMediaInCloud', upload.array("files"), controller.uploadImage.bind(controller));
router.post('/api/user/fetchprofile', controller.visitProfile.bind(controller));
router.post('/api/user/followprofile', controller.followProfile.bind(controller))
router.post('/api/user/checkFollowingStatus', controller.checkFollowingStatus.bind(controller))
router.post('/api/user/fetchFeed', controller.fetchFeed.bind(controller))
router.post('/api/user/likepost', controller.likePost.bind(controller))


router.post('/api/user/postComment', controller.postComment.bind(controller))
router.post('/api/user/uploadStory', controller.uploadStory.bind(controller))
router.post('/api/user/reportPost', controller.reportPost.bind(controller))
router.post('/api/user/updateProfile', controller.updateProfile.bind(controller))

router.post('/api/admin/fetch-notifications', async (req, res) => {
    console.log("fetch notifications", req.body);
    // const notifications = await Notification.find({userId:req.body.userId})
    const notifications = await Notification.find({ user: req.body.userId })
        .populate('interactorId', 'username profilePicture') // Populate interactorId with specific fields
        .exec();
    console.log(notifications, "notifications");
    res.json({ notifications })


})

router.post('/api/user/updateReadStatus', async (req, res) => {
    console.log("update read status", req.body);
    const { sender, recipient } = req.body
    const messages = await Message.updateMany(
        {
            $or: [
                // { sender: sender, receiver: recipient },
                { sender: recipient, receiver: sender },
            ],
            isRead: false
        },
        {
            $set: { isRead: true }
        })
    res.json({ messages })

})

router.post('/api/user/sendImageInChat', async (req, res) => {
    console.log("sendImageInChat", req.body);
    res.json({})

})

router.post('/api/user/fetchHistoricalData', async (req, res) => {
    // console.log("fetchHistoricalData() hit", req.body);
    const { senderId, receiverId } = req.body
    const messages = await Message.find({
        $or: [
            { sender: senderId, receiver: receiverId },
            { sender: receiverId, receiver: senderId },
        ]
    }).sort({ timestamp: 1 })

    // console.log(messages);


    res.json({ messages })

})

router.post('/api/user/fetchChatList', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const following = user.following || [];
        const followingUsers = await UserModel.find({ _id: { $in: following } });

        res.json({ followingUsers });
    } catch (error) {
        console.error('Error fetching chat list:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/api/user/visitPost', async (req, res) => {
    console.log("visit post", req.body);
    const idPost = new mongoose.Types.ObjectId(req.body.postId)
    const result = await PostModel.findById(req.body.postId).populate('userId')
    const comments = await CommentModel.find({ postId: idPost }).populate('userId')

    console.log(result, "result");

    res.json({ result, comments })


})


router.post('/create-payment-intent', async (req, res) => {
    console.log("Payment intent endpoint HIT", req.body);

    const { amount, userId, currency = 'usd' } = req.body; // Default to 'usd' if currency is not provided

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount, // Amount in the smallest currency unit (e.g., cents)
            currency, // Currency (e.g., 'usd')
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
        });

        const user = await UserModel.findById(userId)
        console.log(user);
        if (!user) {
            return
        }
        user.roles = UserRole.Premium
        await user.save()

    } catch (error) {
        console.log(error, "error");

        // res.status(400).send({ error: error.message });
    }
});

router.post('/api/user/premiumStatus', async (req, res) => {
    const user = await UserModel.findById(req.body.userId)
    if (!user) {
        return
    }
    console.log(user.roles);

    const role = user.roles

    res.json({ role })
    console.log("premium status ", req.body);

})


// router.post('/api/user/updateProfile', async (req, res) => {
//     try {
//         // Extract data from the request body
//         const { name, bio, email } = req.body;

//         console.log(req.body);

//         const user = await UserModel.findOne({ email })
//         if (!user) {
//             console.log("user not found");
//             return
//         }
//         console.log(user);
//         user.bio = bio
//         user.name = name
//         await user.save()

//         // Respond with success
//         res.json({ success: true, message: 'Profile updated successfully' });

//     } catch (error) {
//         console.error('Error updating profile:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// });

router.post('/api/user/savePost', async (req, res) => {
    // console.log("save post", req.body);
    const objectId = new mongoose.Types.ObjectId(req.body.postId)
    const user = await UserModel.findById(req.body.userId)
    // console.log(user);
    if (!user) {
        return
    }
    if (!user.savedPosts) {
        user.savedPosts = []
    }
    if (!user.savedPosts.includes(objectId)) {
        user.savedPosts.push(objectId)

    }
    await user.save()
    // console.log(user);


    res.json({})




})

router.post('/api/user/uploadProfile', async (req, res) => {
    console.log("profile has been uploaded", req.body);
    const { url, userId } = req.body
    console.log(req.body.userId);
    const objectId = new mongoose.Types.ObjectId(userId)
    const user = await UserModel.findById(objectId)
    if (!user) {
        return res.status(404).json({ error: "user not found" })
    }
    user.profilePicture = url
    await user.save()
    res.json({ url })

})
router.post('/api/user/fetchStories', async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await UserModel.findById(userId).select('following');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const followingList = user.following || [];

        const stories = await StoryModel.aggregate([
            { $match: { userId: { $in: followingList } } },
            {
                $lookup: {
                    from: 'users', // collection name in MongoDB
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' },
            {
                $project: {
                    _id: 1,
                    userId: 1,
                    imageUrl: 1,
                    createdAt: 1,
                    'userDetails.username': 1,
                    'userDetails.profilePicture': 1
                }
            }
        ]);

        return res.json({ stories });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});

// router.post('/api/user/fetchFeed', controller.fetchFeed)
// Export the router
export default router;
