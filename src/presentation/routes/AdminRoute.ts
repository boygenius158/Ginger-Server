import express, { response } from 'express'

import { AdminRepository } from '../../infrastructure/repository/AdminRepository'
import { AdminUseCase } from '../../application/usecase/AdminUseCase'
import { AdminController } from '../controllers/AdminController'
const bcrypt = require('bcryptjs')
const router = express.Router()

const repo = new AdminRepository()
const service = new AdminUseCase(repo)
const adminController = new AdminController(service)
import verifyJWT from '../../utils/verifyJWT';
import Report from '../../infrastructure/database/model/ReportModel'
import { PostModel } from '../../infrastructure/database/model/PostModel'
import UserModel from '../../infrastructure/database/model/UserModel'

router.get('/api/admin/premium-payment-details', verifyJWT, adminController.fetchPremiumPaymentDetails.bind(adminController));
router.post('/api/admin/userDetails', verifyJWT, adminController.fetchUserDetailsByRoles.bind(adminController));
router.post('/api/admin/blockUser', verifyJWT, adminController.blockUser.bind(adminController));
router.get('/api/admin/total-revenue', verifyJWT, adminController.getTotalRevenue.bind(adminController));
router.post('/api/admin/unblockUser', verifyJWT, adminController.unblockUser.bind(adminController));
router.post('/api/admin/getBlockedUsers', verifyJWT, adminController.getBlockedUsers.bind(adminController));
router.post('/api/admin/filterPost', verifyJWT, adminController.handle.bind(adminController));
router.post('/api/admin/banPost', verifyJWT, adminController.banPost.bind(adminController));

// router.post('/api/admin/banPost', async (req, res) => {
//     console.log("ban", req.body);
//     const { postId } = req.body
//     const post = await PostModel.findByIdAndDelete(postId)
//     res.json({})

// })
// router.post('/api/admin/banPost')
// router.post('/api/admin/filterPost', async (req, res) => {
//     console.log("filter post");
//     const posts = await Report.find({}).populate({
//         path: 'postId',
//         populate: {
//             path: 'userId'
//         }
//     })
//         .sort({ createdAt: -1 })
//         .exec();

//     return res.json({ posts })

// })
router.get('/api/admin/user-demographics-info', async (req, res) => {
    try {
        // Use aggregation to count the number of users with specific roles
        const counts = await UserModel.aggregate([
            {
                $match: {
                    roles: { $in: ['user', 'premium'] } // Include only user and premium roles
                }
            },
            {
                $group: {
                    _id: '$roles', // Group by the roles
                    count: { $sum: 1 } // Count each role
                }
            }
        ]);

        // Format the response data
        const responseData = counts.map(roleCount => ({
            label: roleCount._id,
            value: roleCount.count
        }));

        // Send the response
        res.json(responseData);
    } catch (error) {
        console.error("Error fetching user demographics info:", error);
        res.status(500).json({ error: 'Server error' });
    }
});

export default router   