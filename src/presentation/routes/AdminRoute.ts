import mongoose from 'mongoose'
import express from 'express'
// import { AdminRepository } from '../../infrastructure/repository/adminRepository'
// import { AdminUseCase } from '../../application/usecase/AdminUseCase'
// import { AdminController } from '../controllers/adminController'
import UserModel from '../../infrastructure/database/model/authModel'
import { PostModel } from '../../infrastructure/database/model/PostModel'
import Report from '../../infrastructure/database/model/ReportModel'
const router = express.Router()


//adminrepository
//adminUseCase
//adminController
//userModel

// const repo = new AdminRepository()
// const adminUseCase = new AdminUseCase(repo)
// const controller = new AdminController(adminUseCase)

// router.post('/admin/dashboard',controller.fetchBarChart.bind(controller))
router.post('/api/admin/userDetails', async (req, res) => {
    console.log("admin userDetails has been hit");
    const userDetails = await UserModel.find({ roles: { $in: ['user', "premium"] } })
    console.log(userDetails);


    res.json({ userDetails })

})
router.post('/api/admin/blockUser', async (req, res) => {
    console.log("admin blockUser has been hit");
    const { userId } = req.body
    console.log(userId);

    const user = await UserModel.findByIdAndUpdate(userId)
    if (user) {
        user.isBlocked = true
    }

    await user?.save()

    res.json({})

})
router.post('/api/admin/unblockUser', async (req, res) => {
    console.log("admin blockUser has been hit");
    const { userId } = req.body
    console.log(userId);

    const user = await UserModel.findByIdAndUpdate(userId)
    if (user) {
        user.isBlocked = false
    }

    await user?.save()

    res.json({})

})

router.post('/api/admin/getBlockedUsers', async (req, res) => {
    console.log("get-blocked-users");

    // Fetch only the _id of the blocked users
    const blockedUsers = await UserModel.find({ isBlocked: true }).select('_id');

    // Extract the _id values into an array
    const blockedUserIds = blockedUsers.map(user => user._id);

    console.log(blockedUserIds, "blockedUserIds");
    res.json({ blockedUserIds });
});


router.post('/api/admin/filterPost', async (req, res) => {
    // console.log("filterPost triggered");

    const post = await Report.find({ actionTaken: false })
        .populate({
            path: 'postId',
            populate: {
                path: 'userId'
            }
        });

    // console.log(post);

    res.json({ post });
});
router.post('/api/admin/banPost', async (req, res) => {
    console.log("banPost triggered", req.body.postId);
    const post = await PostModel.findById(req.body.postId)
    if (!post) {
        return null
    }
    post.isBanned = true
    await post.save()



    res.json({});
});

router.post('/api/admin/changeUsername', (req, res) => {
    console.log("change username");
    res.json({ success: true })

})

// router.post('/api/admin/chartData', async (req, res) => {
//     try {
//         console.log("chartData hit");
//         const data = await UserModel.aggregate([
//             { $match: { roles: { $ne: 'admin' } } },
//             { $project: { _id: 0, username: 1, followerCount: { $size: { $ifNull: ['$followers', []] } } } },
//             { $sort: { followerCount: -1 } },
//             { $limit: 3 }
//         ]);

//         // Debugging
//         console.log("Aggregation result:", data);

//         if (data.length === 0) {
//             console.log("No data found");
//         }

//         // Ensure valid JSON response
//         res.status(200).json({ success: true, message: data });
//     } catch (error) {
//         console.error("Error occurred:", error);
//         res.status(500).json({ success: false, message: "Internal Server Error" });
//     }
// });





export default router  