import mongoose from 'mongoose'
import express from 'express'

import UserModel from '../../infrastructure/database/model/authModel'
import { PostModel } from '../../infrastructure/database/model/PostModel'
import Report from '../../infrastructure/database/model/ReportModel'
import { AdminRepository } from '../../infrastructure/repository/AdminRepository'
import { AdminUseCase } from '../../application/usecase/AdminUseCase'
import { AdminController } from '../controllers/adminController'
const bcrypt = require('bcryptjs')
const router = express.Router()



// const repo = new AdminRepository()
// const adminUseCase = new AdminUseCase(repo)
// const controller = new AdminController(adminUseCase)
const repo = new AdminRepository()
const service = new AdminUseCase(repo)
const adminController = new AdminController(service)

router.get('/api/admin/premium-payment-details', adminController.fetchPremiumPaymentDetails.bind(adminController));
router.post('/api/admin/userDetails', adminController.fetchUserDetailsByRoles.bind(adminController));
router.post('/api/admin/blockUser', adminController.blockUser.bind(adminController));
router.get('/api/admin/total-revenue', adminController.getTotalRevenue.bind(adminController));
router.post('/api/admin/unblockUser', adminController.unblockUser.bind(adminController));
router.post('/api/admin/getBlockedUsers', adminController.getBlockedUsers.bind(adminController));
router.post('/api/admin/filterPost', adminController.handle.bind(adminController));
router.post('/api/admin/banPost', adminController.banPost.bind(adminController));

// router.post('/admin/dashboard',controller.fetchBarChart.bind(controller))
// router.post('/api/admin/userDetails', async (req, res) => {
//     console.log("admin userDetails has been hit");
//     const userDetails = await UserModel.find({ roles: { $in: ['user', "premium"] } })
//     console.log(userDetails);


//     res.json({ userDetails })

// })
// router.post('/api/admin/blockUser', async (req, res) => {
//     console.log("admin blockUser has been hit");
//     const { userId } = req.body
//     console.log(userId);

//     const user = await UserModel.findByIdAndUpdate(userId)
//     if (user) {
//         user.isBlocked = true
//     }

//     await user?.save()

//     res.json({})

// })
// router.post('/api/admin/unblockUser', async (req, res) => {
//     console.log("admin blockUser has been hit");
//     const { userId } = req.body
//     console.log(userId);

//     const user = await UserModel.findByIdAndUpdate(userId)
//     if (user) {
//         user.isBlocked = false
//     }

//     await user?.save()

//     res.json({})

// })

// router.post('/api/admin/getBlockedUsers', async (req, res) => {
//     console.log("get-blocked-users");

//     // Fetch only the _id of the blocked users
//     const blockedUsers = await UserModel.find({ isBlocked: true }).select('_id');

//     // Extract the _id values into an array
//     const blockedUserIds = blockedUsers.map(user => user._id);

//     console.log(blockedUserIds, "blockedUserIds");
//     res.json({ blockedUserIds });
// });


// router.post('/api/admin/filterPost', async (req, res) => {
//     // console.log("filterPost triggered");

//     const post = await Report.find({ actionTaken: false })
//         .populate({
//             path: 'postId',
//             populate: {
//                 path: 'userId'
//             }
//         });

//     // console.log(post);

//     res.json({ post });
// });
// router.post('/api/admin/banPost', async (req, res) => {
//     console.log("banPost triggered", req.body.postId);
//     const post = await PostModel.findById(req.body.postId)
//     if (!post) {
//         return null
//     }
//     post.isBanned = true
//     await post.save()



//     res.json({});
// });

// router.post('/api/user/fetch-name-username', async (req, res) => {
//     console.log("change username", req.body);
//     const user = await UserModel.findById(req.body.id)
//     if (!user) {
//         throw new Error
//     }
//     res.json({ user })


// })

// router.post('/api/user/has-password', async (req, res) => {
//     try {
//         const { id } = req.body;  // Extract the user ID from the request body
//         console.log(id);  // Log the ID for debugging

//         // Find the user by ID
//         const user = await UserModel.findById(id);

//         // If user is not found, return a 404 error
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Check if the password is null or not
//         if (user.password === null || user.password === undefined) {
//             return res.json({ hasPassword: false, message: 'Password is not set' });
//         }

//         // If password is set, return true
//         res.json({ hasPassword: true, message: 'Password is set' });
//     } catch (error) {
//         console.error('Error checking password field:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });


// router.post('/api/user/update-user', async (req, res) => {
//     try {
//         console.log("update user", req.body.id, req.body.name, req.body.username);

//         // Find the user by ID
//         const user = await UserModel.findById(req.body.id);
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Check if the username is already taken by another user
//         if (req.body.username && req.body.username !== user.username) {
//             const existingUser = await UserModel.findOne({ username: req.body.username });
//             if (existingUser) {
//                 // return res.status(400).json({ error: 'Username already exists' });
//                return res.json({ success: false })
//             }
//         }

//         // Update user details
//         user.name = req.body.name || user.name;
//         user.username = req.body.username || user.username;

//         // Save the updated user
//         await user.save();

//         // Respond with the updated user
//         res.json({ success: true, user });
//     } catch (error) {
//         console.error("Error updating user:", error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });

// router.post('/api/user/update-password', async (req, res) => {
//     try {
//         const { id, currentPassword, newPassword } = req.body;

//         // Check if user exists
//         const user = await UserModel.findById(id);
        
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }

//         // Case 1: User is setting password for the first time (current password not provided or user.password is null)
//         if (!user.password && !currentPassword) {
//             // Hash the new password
//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(newPassword, salt);

//             // Set and save the new password
//             user.password = hashedPassword;
//             await user.save();

//             return res.json({ success: true, message: 'Password set successfully' });
//         }

//         // Case 2: User already has a password and is trying to change it
//         if (user.password && currentPassword) {
//             // Check if the current password matches
//             const oldPassword = await bcrypt.hash(currentPassword)
//             const newPassword = await bcrypt.hash(user.password)
//             if(oldPassword===newPassword){
//                 res.json({error:'password is same'})
//             }
//             const isMatch = await bcrypt.compare(currentPassword, user.password);
//             if (!isMatch) {
//                 console.log("no match");
                
//                 return res.status(401).json({ error: 'Current password is incorrect' });
//             }

//             // Hash the new password
//             const salt = await bcrypt.genSalt(10);
//             const hashedPassword = await bcrypt.hash(newPassword, salt);

//             // Update the user's password in the database
//             user.password = hashedPassword;
//             await user.save();

//             return res.json({ success: true, message: 'Password updated successfully' });
//         }

//         // Case 3: Either password fields are missing
//         return res.status(400).json({ error: 'Invalid request: Missing current or new password' });

//     } catch (error) {
//         console.error('Error updating password:', error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });



export default router  