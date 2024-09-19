import express from 'express'

import { AdminRepository } from '../../infrastructure/repository/AdminRepository'
import { AdminUseCase } from '../../application/usecase/AdminUseCase'
import { AdminController } from '../controllers/AdminController'
const bcrypt = require('bcryptjs')
const router = express.Router()

const repo = new AdminRepository()
const service = new AdminUseCase(repo)
const adminController = new AdminController(service)
import verifyJWT from '../../utils/verifyJWT';

router.get('/api/admin/premium-payment-details', verifyJWT, adminController.fetchPremiumPaymentDetails.bind(adminController));
router.post('/api/admin/userDetails', verifyJWT, adminController.fetchUserDetailsByRoles.bind(adminController));
router.post('/api/admin/blockUser', verifyJWT, adminController.blockUser.bind(adminController));
router.get('/api/admin/total-revenue', verifyJWT, adminController.getTotalRevenue.bind(adminController));
router.post('/api/admin/unblockUser', verifyJWT, adminController.unblockUser.bind(adminController));
router.post('/api/admin/getBlockedUsers', verifyJWT, adminController.getBlockedUsers.bind(adminController));
router.post('/api/admin/filterPost', verifyJWT, adminController.handle.bind(adminController));
router.post('/api/admin/banPost', verifyJWT, adminController.banPost.bind(adminController));


export default router  