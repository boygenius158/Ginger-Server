import express from 'express'
import { DatingRepository } from '../../infrastructure/repository/DatingRepository';
import { DatingUseCase } from '../../application/usecase/DatingUseCase';
import { DatingController } from '../controllers/DatingController';
import verifyJWT from '../../utils/verifyJWT';
import DatingProfile from '../../infrastructure/database/model/DatingProfileMode';
import { CustomRequest } from '../../application/interface/CustomRequest';
const router = express.Router()



const repo = new DatingRepository()
const service = new DatingUseCase(repo)
const datingController = new DatingController(service)

router.post('/api/user/user-posted-comment', verifyJWT, datingController.userPostedComment.bind(datingController))
router.get('/api/user/swipe-profiles', verifyJWT, datingController.swipeProfile.bind(datingController));
router.post('/api/user/dating-tab2', verifyJWT, datingController.updateDatingProfileImages.bind(datingController));
router.get('/api/user/fetch-matches', verifyJWT, datingController.fetchMatches.bind(datingController));
router.post('/api/user/dating-tab1', verifyJWT, datingController.handleDatingTab1.bind(datingController));
router.post('/api/user/dating-tab3', verifyJWT, datingController.handleDatingTab3.bind(datingController));
router.post('/api/user/dating-tab4', verifyJWT, datingController.handleDatingTab4.bind(datingController));
router.get('/api/user/settings', verifyJWT, datingController.handleUserSettings.bind(datingController));
router.get('/api/user/dating-tab1-getdetails', verifyJWT, datingController.getDatingTab1Details.bind(datingController));
router.post('/api/user/delete-comment', verifyJWT, datingController.deleteComment.bind(datingController))
router.post('/api/user/delete-post', verifyJWT, datingController.deletePost.bind(datingController))
router.post('/api/user/fetch-post-comment', verifyJWT, datingController.fetchPostComment.bind(datingController))
router.post('/api/user/likedUserDetails', verifyJWT, datingController.likedUserDetails.bind(datingController));
router.post('/api/user/delete-commentreply', verifyJWT, datingController.deleteCommentReply.bind(datingController))
router.post('/api/user/post-already-reported', verifyJWT, datingController.postAlreadyReported.bind(datingController))
router.post('/api/user/user-posted-reply', verifyJWT, datingController.userPostedReply.bind(datingController))


//left to fix
// router.post('/api/user/get-user-datingprofile', verifyJWT, datingController.getUserDatingProfile.bind(datingController));



router.post('/api/user/profile-completion-status', verifyJWT, datingController.profileCompletionStatus.bind(datingController))
router.post('/api/user/profile-visibility',verifyJWT,datingController.profileVisibility.bind(datingController))
// router.post('/api/user/profile-visibility',verifyJWT, async (req:CustomRequest, res) => {
//     if(!req.user){
//         return
//     }
//     const userId = req.user.id
//     console.log(req.body);
//     const profile = await DatingProfile.findOne({ userId })
//     if (!profile) {
//         throw new Error
//     }
//     profile.profileVisibility = req.body.profileVisibility
//     await profile.save()
//     res.json({})

// })

export default router