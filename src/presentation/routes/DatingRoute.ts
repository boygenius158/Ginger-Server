import express from 'express'
import { DatingRepository } from '../../infrastructure/repository/DatingRepository';
import { DatingUseCase } from '../../application/usecase/DatingUseCase';
import { DatingController } from '../controllers/DatingController';
const router = express.Router()



const repo = new DatingRepository()
const service = new DatingUseCase(repo)
const datingController = new DatingController(service)

router.post('/api/user/swipe-profiles', datingController.swipeProfile.bind(datingController))
router.post('/api/user/dating-tab2', datingController.updateDatingProfileImages.bind(datingController))
router.post('/api/user/fetch-matches', datingController.fetchMatches.bind(datingController))
router.post('/api/user/get-user-datingprofile', datingController.getUserDatingProfile.bind(datingController));
router.post('/api/user/dating-tab1', datingController.handleDatingTab1.bind(datingController));
router.post('/api/user/dating-tab3', datingController.handleDatingTab3.bind(datingController));
router.post('/api/user/dating-tab4', datingController.handleDatingTab4.bind(datingController));
router.post('/api/user/settings', datingController.handleUserSettings.bind(datingController));
router.post('/api/user/dating-tab1-getdetails', datingController.getDatingTab1Details.bind(datingController));

// router.post('/api/user/dating-tab1',controller.)
// router.post('/api/user/get-user-datingprofile', async (req, res) => {
//     console.log("get profie", req.body);
//     const user = await DatingProfile.findOne({ userId: req.body.userId })
//     res.json({ user })



// })

export default router