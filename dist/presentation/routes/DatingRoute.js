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
const DatingRepository_1 = require("../../infrastructure/repository/DatingRepository");
const DatingUseCase_1 = require("../../application/usecase/DatingUseCase");
const DatingController_1 = require("../controllers/DatingController");
const verifyJWT_1 = __importDefault(require("../../utils/verifyJWT"));
const DatingProfileMode_1 = __importDefault(require("../../infrastructure/database/model/DatingProfileMode"));
const router = express_1.default.Router();
const repo = new DatingRepository_1.DatingRepository();
const service = new DatingUseCase_1.DatingUseCase(repo);
const datingController = new DatingController_1.DatingController(service);
router.post('/api/user/swipe-profiles', verifyJWT_1.default, datingController.swipeProfile.bind(datingController));
router.post('/api/user/dating-tab2', verifyJWT_1.default, datingController.updateDatingProfileImages.bind(datingController));
router.post('/api/user/fetch-matches', verifyJWT_1.default, datingController.fetchMatches.bind(datingController));
router.post('/api/user/get-user-datingprofile', verifyJWT_1.default, datingController.getUserDatingProfile.bind(datingController));
router.post('/api/user/dating-tab1', verifyJWT_1.default, datingController.handleDatingTab1.bind(datingController));
router.post('/api/user/dating-tab3', verifyJWT_1.default, datingController.handleDatingTab3.bind(datingController));
router.post('/api/user/dating-tab4', verifyJWT_1.default, datingController.handleDatingTab4.bind(datingController));
router.post('/api/user/settings', verifyJWT_1.default, datingController.handleUserSettings.bind(datingController));
router.post('/api/user/dating-tab1-getdetails', verifyJWT_1.default, datingController.getDatingTab1Details.bind(datingController));
router.post('/api/admin/delete-record', verifyJWT_1.default, datingController.adminDeleteRecord.bind(datingController));
router.post('/api/user/delete-comment', verifyJWT_1.default, datingController.deleteComment.bind(datingController));
router.post('/api/user/delete-post', verifyJWT_1.default, datingController.deletePost.bind(datingController));
router.post('/api/user/fetch-post-comment', verifyJWT_1.default, datingController.fetchPostComment.bind(datingController));
router.post('/api/user/user-posted-comment', verifyJWT_1.default, datingController.userPostedComment.bind(datingController));
router.post('/api/user/likedUserDetails', verifyJWT_1.default, datingController.likedUserDetails.bind(datingController));
router.post('/api/user/delete-commentreply', verifyJWT_1.default, datingController.deleteCommentReply.bind(datingController));
router.post('/api/user/post-already-reported', verifyJWT_1.default, datingController.postAlreadyReported.bind(datingController));
router.post('/api/user/user-posted-reply', verifyJWT_1.default, datingController.userPostedReply.bind(datingController));
router.post('/api/user/profile-completion-status', verifyJWT_1.default, datingController.profileCompletionStatus.bind(datingController));
router.post('/api/user/profile-visibility', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body);
    const profile = yield DatingProfileMode_1.default.findOne({ userId: req.body.userId });
    if (!profile) {
        throw new Error;
    }
    profile.profileVisibility = req.body.profileVisibility;
    yield profile.save();
}));
exports.default = router;
