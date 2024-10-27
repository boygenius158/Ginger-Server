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

router.get('/api/admin/premium-payment-details', verifyJWT, adminController.fetchPremiumPaymentDetails.bind(adminController));
router.post('/api/admin/userDetails', verifyJWT, adminController.fetchUserDetailsByRoles.bind(adminController));
router.post('/api/admin/blockUser', verifyJWT, adminController.blockUser.bind(adminController));
router.get('/api/admin/total-revenue', verifyJWT, adminController.getTotalRevenue.bind(adminController));
router.post('/api/admin/unblockUser', verifyJWT, adminController.unblockUser.bind(adminController));
router.post('/api/admin/getBlockedUsers', verifyJWT, adminController.getBlockedUsers.bind(adminController));
// router.post('/api/admin/filterPost', verifyJWT, adminController.handle.bind(adminController));
// router.post('/api/admin/banPost', verifyJWT, adminController.banPost.bind(adminController));

router.post('/api/admin/banPost', async (req, res) => {
    console.log("ban", req.body);
    const { postId } = req.body
    const post = await PostModel.findByIdAndDelete(postId)
    res.json({})

})

router.post('/api/admin/filterPost', async (req, res) => {
    console.log("filter post");
    const posts = await Report.find({}).populate({
        path: 'postId',
        populate: {
            path: 'userId'
        }
    })
        .sort({ createdAt: -1 })
        .exec();

    return res.json({ posts })

})

export default router   