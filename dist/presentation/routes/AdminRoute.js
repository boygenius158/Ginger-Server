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
// router.post('/api/admin/banPost', async (req, res) => {
//     console.log("ban", req.body);
//     const { postId } = req.body
//     await PostModel.findByIdAndDelete(postId)
//     res.json({})
// })
// router.post('/api/user/is-post-saved', async (req, res) => {
//     console.log(req.body, "hello");
//     const { userId } = req.body
//     const user = await UserModel.findById(userId)
//     res.json({user})
// })
// router.post('/api/admin/filterPost', async (req, res) => {
//     console.log("filter post");
//         const posts = await Report.find({}).populate({
//             path: 'postId',
//             populate: {
//                 path: 'userId'
//             }
//         })
//             .sort({ createdAt: -1 })
//             .exec();
//         return res.json({ posts })
// })
// router.get('/api/admin/user-demographics-info', async (req, res) => {
//     try {
//         // Use aggregation to count the number of users with specific roles
//         const counts = await UserModel.aggregate([
//             {
//                 $match: {
//                     roles: { $in: ['user', 'premium'] } // Include only user and premium roles
//                 }
//             },
//             {
//                 $group: {
//                     _id: '$roles', // Group by the roles
//                     count: { $sum: 1 } // Count each role
//                 }
//             }
//         ]);
//         // Format the response data
//         const responseData = counts.map(roleCount => ({
//             label: roleCount._id,
//             value: roleCount.count
//         }));
//         // Send the response
//         res.json(responseData);
//     } catch (error) {
//         console.error("Error fetching user demographics info:", error);
//         res.status(500).json({ error: 'Server error' });
//     }
// });
exports.default = router;
