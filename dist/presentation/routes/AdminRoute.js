"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AdminRepository_1 = require("../../infrastructure/repository/AdminRepository");
const AdminUseCase_1 = require("../../application/usecase/AdminUseCase");
const AdminController_1 = require("../controllers/AdminController");
const bcrypt = require('bcryptjs');
const router = express_1.default.Router();
const repo = new AdminRepository_1.AdminRepository();
const service = new AdminUseCase_1.AdminUseCase(repo);
const adminController = new AdminController_1.AdminController(service);
const verifyJWT_1 = __importDefault(require("../../utils/verifyJWT"));
router.get('/api/admin/premium-payment-details', verifyJWT_1.default, adminController.fetchPremiumPaymentDetails.bind(adminController));
router.post('/api/admin/userDetails', verifyJWT_1.default, adminController.fetchUserDetailsByRoles.bind(adminController));
router.post('/api/admin/blockUser', verifyJWT_1.default, adminController.blockUser.bind(adminController));
router.get('/api/admin/total-revenue', verifyJWT_1.default, adminController.getTotalRevenue.bind(adminController));
router.post('/api/admin/unblockUser', verifyJWT_1.default, adminController.unblockUser.bind(adminController));
router.post('/api/admin/getBlockedUsers', verifyJWT_1.default, adminController.getBlockedUsers.bind(adminController));
router.post('/api/admin/filterPost', verifyJWT_1.default, adminController.handle.bind(adminController));
// router.post('/api/admin/banPost', verifyJWT, adminController.banPost.bind(adminController));
router.post('/api/admin/banPost', verifyJWT_1.default, adminController.banPostUser.bind(adminController));
router.post('/api/user/is-post-saved', verifyJWT_1.default, adminController.isPostSaved.bind(adminController));
// router.post('/api/admin/filterPost', verifyJWT, adminController.filterPost.bind(adminController))
router.get('/api/admin/user-demographics-info', verifyJWT_1.default, adminController.userDemoInfo.bind(adminController));
exports.default = router;
