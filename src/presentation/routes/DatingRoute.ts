import express from 'express'
import { DatingRepository } from '../../infrastructure/repository/DatingRepository';
import { DatingUseCase } from '../../application/usecase/DatingUseCase';
import { DatingController } from '../controllers/DatingController';
import verifyJWT from '../../utils/verifyJWT';
const router = express.Router()



const repo = new DatingRepository()
const service = new DatingUseCase(repo)
const datingController = new DatingController(service)


router.post('/api/user/swipe-profiles', datingController.swipeProfile.bind(datingController));
router.post('/api/user/dating-tab2', verifyJWT, datingController.updateDatingProfileImages.bind(datingController));
router.post('/api/user/fetch-matches', verifyJWT, datingController.fetchMatches.bind(datingController));
router.post('/api/user/get-user-datingprofile', verifyJWT, datingController.getUserDatingProfile.bind(datingController));
router.post('/api/user/dating-tab1', datingController.handleDatingTab1.bind(datingController));
router.post('/api/user/dating-tab3', verifyJWT, datingController.handleDatingTab3.bind(datingController));
router.post('/api/user/dating-tab4', verifyJWT, datingController.handleDatingTab4.bind(datingController));
router.post('/api/user/settings', datingController.handleUserSettings.bind(datingController));
router.post('/api/user/dating-tab1-getdetails', datingController.getDatingTab1Details.bind(datingController));


export default router