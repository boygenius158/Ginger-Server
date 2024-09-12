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



router.post('/registeration', controller.signUpUser.bind(controller))
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
router.post('/create-payment-intent', controller.createPaymentIntent.bind(controller));

// export default router;

// router.get('/api/user/searchUser', async (req, res) => {
//     console.log(req.query);

//     const users = await UserModel.find({

//         username: { $regex: '^' + req.query.searchQuery, $options: 'i' }
//     })
//     res.json({ users })

// })

// router.post('/api/user/miniProfile', async (req, res) => {
//     // console.log("profileDetails", req.body);

//     const user = await UserModel.findById(req.body.id)
//     res.json({ user })
//     // console.log("profileDetails", req.body);

// })

// router.post('/api/user/save-user-to-search-history', async (req, res) => {
//     const { userId, key } = req.body;

//     // Check if the combination of userId and searchedProfileId already exists
//     const existingEntry = await ProfileSearchHistoryModel.findOne({
//         userId: userId,
//         searchedProfileId: key._id
//     });

//     if (existingEntry) {
//         // If the combination already exists, return a response indicating so
//         return res.status(200).json({ message: "Entry already exists" });
//     }

//     // If it doesn't exist, create a new entry
//     const searchHistory = new ProfileSearchHistoryModel({
//         userId: userId,
//         searchedProfileId: key._id
//     });

//     await searchHistory.save();
//     res.status(201).json({ message: "Search history saved" });
// })

// router.post('/api/user/get-recent-searches', async (req, res) => {
//     console.log("/api/user/get-recent-searches", req.body);
//     const searches = await ProfileSearchHistoryModel.find({ userId: req.body.userId }).populate('searchedProfileId')

//     res.json({ searches })
// })


// router.post('/api/user/premium-payment', async (req, res) => {
//     console.log(req.body);
//     const userId = req.body.userId
//     const premium = new PremiumModel({
//         userId,
//         amount: 350
//     })
//     await premium.save()

//     console.log("payment server was reached");

// })
// router.post('/api/user/custombackendSession', async (req, res) => {
//     const user = await UserModel.findOne({ email: req.body.email })
//     res.json({ user })
// })
// router.post('/api/user/swipe-profiles', async (req, res) => {
//     console.log("swipe-profiles'", req.body);

//     const { userId, maximumAge, interestedGender } = req.body;

//     try {
//         const profiles = await DatingProfile.find({
//             userId: { $ne: userId },  // Exclude the current user's profile
//             profileVisibility: true,  // Only fetch profiles that are visible
//             age: { $lte: maximumAge || Infinity },  // Apply maximum age filter if provided
//             interestedGender: interestedGender || { $exists: true },  // Apply interested gender filter if provided
//             likedByUsers: { $ne: userId }  // Exclude profiles that the user has already liked
//         });

//         console.log(profiles.length);
//         res.json({ profiles });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "An error occurred while fetching profiles" });
//     }
// });
// router.post('/api/user/upload-dating-images', async (req, res) => {
//     console.log("upload-dating-images", req.body);
//     const profile = new DatingProfile({
//         userId: req.body.userId,
//         name: req.body.formData.name,
//         age: req.body.formData.age,
//         bio: req.body.formData.bio,
//         images: req.body.url

//     })
//     await profile.save()
//     res.json({})

// })

// router.post('/api/user/fetch-matches', async (req, res) => {
//     const { userId } = req.body;
//     console.log(userId,"0999999");
    
//     try {
//         // Find profiles where the current user has liked them and they have liked the current user back
//         const matches = await DatingProfile.find({
//             userId: { $ne: userId },  // Exclude the current user's profile
//             likedUsers: userId,  // The current user has liked these profiles
//             likedByUsers: userId  // These profiles have also liked the current user
//         }).populate('userId')
//         console.log(matches);
        
//         res.json({ matches });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: "An error occurred while fetching matches" });
//     }
// }) 

// router.post('/api/user/get-user-datingprofile', async (req, res) => {
//     console.log("get profie", req.body);
//     const user = await DatingProfile.findOne({ userId: req.body.userId })
//     res.json({ user })



// })


// router.get('/api/admin/premium-payment-details', async (req, res) => {
//     try {
//         const data = await PremiumModel.aggregate([
//             {
//                 $lookup: {
//                     from: 'users', // The collection name in MongoDB for the User model
//                     localField: 'userId',
//                     foreignField: '_id',
//                     as: 'userDetails'
//                 }
//             },
//             {
//                 $unwind: '$userDetails' // Deconstructs the array to output one document per element
//             },
//             {
//                 $project: {
//                     _id: 0, // Exclude the _id field if not needed
//                     username: '$userDetails.username',
//                     email: '$userDetails.email',
//                     profilePicture: '$userDetails.profilePicture',
//                     amount: 1
//                 }
//             }
//         ]);

//         // console.log(data);
//         res.json(data);
//     } catch (error) {
//         console.error('Error fetching premium payment details:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });

// router.get('/api/admin/total-revenue', async (req, res) => {
//     try {
//         // Get the current date
//         const currentDate = new Date();

//         // Calculate the date 30 days ago from the current date
//         const thirtyDaysAgo = new Date();
//         thirtyDaysAgo.setDate(currentDate.getDate() - 30);

//         // Aggregate the total amount for the past 30 days
//         const result = await PremiumModel.aggregate([
//             {
//                 $match: {
//                     createdAt: {
//                         $gte: thirtyDaysAgo,
//                         $lte: currentDate,
//                     },
//                 },
//             },
//             {
//                 $group: {
//                     _id: null,
//                     totalRevenue: { $sum: '$amount' },
//                 },
//             },
//         ]);

//         // Extract the total revenue from the result
//         const totalRevenue = result.length > 0 ? result[0].totalRevenue : 0;

//         // Send the total revenue as a response
//         res.json({ totalRevenue });
//         console.log("Total revenue for the past 30 days:", totalRevenue);
//     } catch (error) {
//         console.error("Error calculating total revenue:", error);
//         res.status(500).json({ error: "Internal Server Error" });
//     }
// });


// router.get('/admin/dashboard', async (req, res) => {
//     console.log("admin dashboard h  as been hit");
//     const data = await UserModel.find({})
//     // console.log(data);

//     res.json({ data })

// })

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