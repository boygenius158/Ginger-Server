"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const authController_1 = require("../controllers/authController");
const authRepository_1 = require("../../infrastructure/repository/authRepository");
const authUseCase_1 = require("../../application/usecase/authUseCase");
const router = express_1.default.Router();
const repo = new authRepository_1.AuthRepository();
const auth = new authUseCase_1.AuthUseCase(repo);
const controller = new authController_1.authController(auth);
router.post('/registeration', controller.signUpUser.bind(controller));
router.post('/api/user/custombackend', controller.loginUser.bind(controller));
router.post('/api/user', controller.googleAuth.bind(controller));
router.post('/api/user/forgetpassword', controller.forgetPassword.bind(controller));
router.post('/api/user/resetpassword', controller.changePassword.bind(controller));
router.post('/api/user/register/generateotp', controller.generateotp.bind(controller));
// router.post('/api/user/register/clearotp',(req,res)=>{
//     console.log("otp has been cleared");
// })
router.post('/api/user/register/clearotp', controller.clearotp.bind(controller));
// router.post('/api/user/register/newcode',(req,res)=>{
//     console.log("new code has been requested");
// })
router.post('/api/user/register/verifyotp', controller.verifyotp.bind(controller));
router.post('/api/user/checkrole', controller.checkRole.bind(controller));
exports.default = router;
