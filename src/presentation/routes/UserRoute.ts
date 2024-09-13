import express from 'express'
import { authController } from '../controllers/UserController'
import { AuthRepository } from '../../infrastructure/repository/UserRepository'
import { AuthUseCase } from '../../application/usecase/UserUseCase'
import UserModel from '../../infrastructure/database/model/UserModel'
import { Schema } from 'mongoose'
import { PremiumModel } from '../../infrastructure/database/model/PremiumModel'
import ProfileSearchHistoryModel from '../../infrastructure/database/model/SearchHistoryModel'
import Message from '../../infrastructure/database/model/MessageModel'
import DatingProfile from '../../infrastructure/database/model/DatingProfileMode'

const router = express.Router()

const repo = new AuthRepository()
const auth = new AuthUseCase(repo)
const controller = new authController(auth)



router.post('/api/registeration', controller.signUpUser.bind(controller))
router.post('/api/user/custombackend', controller.loginUser.bind(controller))
router.post('/api/user/google', controller.googleAuth.bind(controller))
router.post('/api/user/forgetpassword', controller.forgetPassword.bind(controller))
router.post('/api/user/resetpassword', controller.changePassword.bind(controller))
router.post('/api/user/register/generateotp', controller.generateotp.bind(controller))
router.post('/api/user/register/clearotp', controller.clearotp.bind(controller))
router.post('/api/user/register/verifyotp', controller.verifyotp.bind(controller))
router.post('/api/user/checkrole', controller.checkRole.bind(controller))
router.post('/api/user/uploadProfile', controller.uploadProfile.bind(controller));
router.get('/api/user/searchUser', controller.searchUser.bind(controller));
router.post('/api/user/fetch-name-username', controller.fetchNameUsername.bind(controller));
router.post('/api/user/has-password', controller.hasPassword.bind(controller));
router.post('/api/user/update-user', controller.updateUser.bind(controller));
router.post('/api/user/update-password', controller.updatePassword.bind(controller));
router.post('/api/user/miniProfile', controller.miniProfile.bind(controller));
router.post('/api/user/save-user-to-search-history', controller.saveUserToSearchHistory.bind(controller));
router.post('/api/user/get-recent-searches', controller.getRecentSearches.bind(controller));
router.post('/api/user/premium-payment', controller.premiumPayment.bind(controller));
router.post('/api/user/custombackendSession', controller.customBackendSession.bind(controller));
router.post('/api/create-payment-intent', controller.createPaymentIntent.bind(controller));




interface ChartData {
    username: string;
    followers: number;
    fill: string;
}

interface ChartConfig {
    [key: string]: {
        label: string;
        color: string;
    };
}

router.get('/api/admin/chartData1', async (req, res) => {
    try {
        // console.log("chartData hit");

        const data = await UserModel.aggregate([
            { $match: { roles: { $ne: 'admin' } } },
            { $project: { _id: 0, username: 1, followerCount: { $size: { $ifNull: ['$followers', []] } } } },
            { $sort: { followerCount: -1 } },
            { $limit: 3 }
        ]);

        // console.log("Aggregation result:", data);

        if (data.length === 0) {
            console.log("No data found");
        }

        // Map the aggregation result to the required chartData format
        const chartData: ChartData[] = data.map(user => ({
            username: user.username,
            followers: user.followerCount,
            fill: "var(--color-other)" // Replace this with actual color logic if needed
        }));

        // Generate chartConfig dynamically based on chartData
        const chartConfig: ChartConfig = chartData.reduce((config, user, index) => {

            const colorVar = `--chart-${index + 2}`;
            // console.log(colorVar);

            config[user.username] = {
                label: user.username,
                color: `hsl(var(${colorVar}))`
            };
            return config;
        }, {} as ChartConfig);

        // Add any additional static or predefined configurations
        chartConfig.visitors = {
            label: "Visitors",
            color: 'hsl(var(--chart-visitors))' // Add a default color if needed
        };

        res.status(200).json({ success: true, chartData, chartConfig });

    } catch (error) {
        console.error("Error occurred:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});









export default router