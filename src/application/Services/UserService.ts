import { Types } from "mongoose";
import UserModel from "../../infrastructure/database/model/authModel";
import DatingProfile from "../../infrastructure/database/model/DatingProfileMode";


class UserService {
    async findEmailWithUserId(userId: Types.ObjectId) {
        console.log("retreo",userId);
        
        const user = await UserModel.findById(userId)
        const email = user?.email
        console.log("email",email);
        return email
        

    }
    async findUserDetails(userId:Types.ObjectId){
        const user = await UserModel.findById(userId)
        return user
    }
    async findDatingProfile(userId:Types.ObjectId){
        const user = await DatingProfile.findOne({userId})
        return user
    }
}

export default new UserService() 