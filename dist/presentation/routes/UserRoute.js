"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const UserRepository_1 = require("../../infrastructure/repository/UserRepository");
const UserUseCase_1 = require("../../application/usecase/UserUseCase");
const verifyJWT_1 = __importDefault(require("../../utils/verifyJWT"));
const router = express_1.default.Router();
const repo = new UserRepository_1.UserRepository();
const auth = new UserUseCase_1.UserUseCase(repo);
const controller = new UserController_1.UserController(auth);
router.post('/api/user/custom-signin', controller.loginUser.bind(controller));
router.post('/api/registration', controller.signUpUser.bind(controller));
router.post('/api/user/google-auth', controller.googleAuth.bind(controller));
router.post('/api/user/forgetpassword', controller.forgetPassword.bind(controller));
router.post('/api/user/resetpassword', controller.changePassword.bind(controller));
router.post('/api/user/register/generateotp', controller.generateotp.bind(controller));
router.post('/api/user/register/clearotp', controller.clearotp.bind(controller)); // No JWT verification
router.post('/api/user/register/verifyotp', controller.verifyotp.bind(controller));
router.post('/api/user/custom-registration', controller.customBackendSession.bind(controller));
// Routes that require `verifyJWT` 
router.post('/api/user/checkrole', verifyJWT_1.default, controller.checkRole.bind(controller));
router.post('/api/user/uploadProfile', verifyJWT_1.default, controller.uploadProfile.bind(controller));
router.get('/api/user/searchUser', verifyJWT_1.default, controller.searchUser.bind(controller));
router.post('/api/user/fetch-name-username', verifyJWT_1.default, controller.fetchNameUsername.bind(controller));
router.post('/api/user/has-password', controller.hasPassword.bind(controller));
router.post('/api/user/update-user', verifyJWT_1.default, controller.updateUser.bind(controller));
router.post('/api/user/update-password', verifyJWT_1.default, controller.updatePassword.bind(controller));
router.post('/api/user/miniProfile', controller.miniProfile.bind(controller));
router.post('/api/user/save-user-to-search-history', verifyJWT_1.default, controller.saveUserToSearchHistory.bind(controller));
router.post('/api/user/get-recent-searches', verifyJWT_1.default, controller.getRecentSearches.bind(controller));
router.post('/api/user/premium-payment', verifyJWT_1.default, controller.premiumPayment.bind(controller));
router.post('/api/create-payment-intent', controller.createPaymentIntent.bind(controller));
// router.post('/api/user/user-posted-reply',controller.)
exports.default = router;
