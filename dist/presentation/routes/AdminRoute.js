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
const ReportModel_1 = __importDefault(require("../../infrastructure/database/model/ReportModel"));
const PostModel_1 = require("../../infrastructure/database/model/PostModel");
router.get('/api/admin/premium-payment-details', verifyJWT_1.default, adminController.fetchPremiumPaymentDetails.bind(adminController));
router.post('/api/admin/userDetails', verifyJWT_1.default, adminController.fetchUserDetailsByRoles.bind(adminController));
router.post('/api/admin/blockUser', verifyJWT_1.default, adminController.blockUser.bind(adminController));
router.get('/api/admin/total-revenue', verifyJWT_1.default, adminController.getTotalRevenue.bind(adminController));
router.post('/api/admin/unblockUser', verifyJWT_1.default, adminController.unblockUser.bind(adminController));
router.post('/api/admin/getBlockedUsers', verifyJWT_1.default, adminController.getBlockedUsers.bind(adminController));
// router.post('/api/admin/filterPost', verifyJWT, adminController.handle.bind(adminController));
// router.post('/api/admin/banPost', verifyJWT, adminController.banPost.bind(adminController));
router.post('/api/admin/banPost', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("ban", req.body);
    const { postId } = req.body;
    const post = yield PostModel_1.PostModel.findByIdAndDelete(postId);
    res.json({});
}));
router.post('/api/admin/filterPost', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("filter post");
    const posts = yield ReportModel_1.default.find({}).populate({
        path: 'postId',
        populate: {
            path: 'userId'
        }
    })
        .sort({ createdAt: -1 })
        .exec();
    return res.json({ posts });
}));
exports.default = router;
