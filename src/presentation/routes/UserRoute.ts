import express from 'express'
import { authController } from '../controllers/UserController'
import { AuthRepository } from '../../infrastructure/repository/UserRepository'
import { AuthUseCase } from '../../application/usecase/UserUseCase'
import UserModel from '../../infrastructure/database/model/UserModel'
import verifyJWT from '../../utils/verifyJWT'
import { ChartConfig, ChartData } from '../../application/interface/ChartInterfaces'
const jwt = require("jsonwebtoken");

const router = express.Router()

const repo = new AuthRepository()
const auth = new AuthUseCase(repo)
const controller = new authController(auth)



router.post("/refresh-token", (req, res) => {
    const { refreshToken } = req.body;

    // Validate refresh token
    jwt.verify(refreshToken, "helloworld", (err: any, user: any) => {
        if (err) return res.status(403).json({ message: "Invalid refresh token" });

        // Generate new access token
        const newAccessToken = jwt.sign(
            { id: user.id, roles: user.roles },
            "helloworld",
            { expiresIn: "30m" } // Extend token expiration as needed
        );

        res.json({ accessToken: newAccessToken });
    });
});


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
router.post('/api/user/checkrole', verifyJWT, controller.checkRole.bind(controller));
router.post('/api/user/uploadProfile', verifyJWT, controller.uploadProfile.bind(controller));
router.get('/api/user/searchUser', verifyJWT, controller.searchUser.bind(controller));
router.post('/api/user/fetch-name-username', verifyJWT, controller.fetchNameUsername.bind(controller));
router.post('/api/user/has-password', verifyJWT, controller.hasPassword.bind(controller));
router.post('/api/user/update-user', verifyJWT, controller.updateUser.bind(controller));
router.post('/api/user/update-password', verifyJWT, controller.updatePassword.bind(controller));
router.post('/api/user/miniProfile', controller.miniProfile.bind(controller));
router.post('/api/user/save-user-to-search-history', verifyJWT, controller.saveUserToSearchHistory.bind(controller));
router.post('/api/user/get-recent-searches', verifyJWT, controller.getRecentSearches.bind(controller));
router.post('/api/user/premium-payment', verifyJWT, controller.premiumPayment.bind(controller));
router.post('/api/create-payment-intent', controller.createPaymentIntent.bind(controller));






export default router