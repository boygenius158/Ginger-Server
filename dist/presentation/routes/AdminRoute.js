"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const UserModel_1 = __importDefault(require("../../infrastructure/database/model/UserModel"));
router.get('/api/admin/premium-payment-details', verifyJWT_1.default, adminController.fetchPremiumPaymentDetails.bind(adminController));
router.post('/api/admin/userDetails', verifyJWT_1.default, adminController.fetchUserDetailsByRoles.bind(adminController));
router.post('/api/admin/blockUser', verifyJWT_1.default, adminController.blockUser.bind(adminController));
router.get('/api/admin/total-revenue', verifyJWT_1.default, adminController.getTotalRevenue.bind(adminController));
router.post('/api/admin/unblockUser', verifyJWT_1.default, adminController.unblockUser.bind(adminController));
router.post('/api/admin/getBlockedUsers', verifyJWT_1.default, adminController.getBlockedUsers.bind(adminController));
router.post('/api/admin/filterPost', verifyJWT_1.default, adminController.handle.bind(adminController));
router.post('/api/admin/banPost', verifyJWT_1.default, adminController.banPost.bind(adminController));
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
router.get('/api/admin/user-demographics-info', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Use aggregation to count the number of users with specific roles
        const counts = yield UserModel_1.default.aggregate([
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
    }
    catch (error) {
        console.error("Error fetching user demographics info:", error);
        res.status(500).json({ error: 'Server error' });
    }
}));
exports.default = router;
