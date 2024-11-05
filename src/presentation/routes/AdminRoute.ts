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
// router.post('/api/admin/banPost', verifyJWT, adminController.banPost.bind(adminController));
router.post('/api/admin/banPost', verifyJWT, adminController.banPostUser.bind(adminController))
router.post('/api/user/is-post-saved', verifyJWT, adminController.isPostSaved.bind(adminController))
// router.post('/api/admin/filterPost', verifyJWT, adminController.filterPost.bind(adminController))
router.get('/api/admin/user-demographics-info', verifyJWT, adminController.userDemoInfo.bind(adminController))




export default router   