import { Types } from "mongoose";
import UserModel from "../../infrastructure/database/model/UserModel";
import DatingProfile from "../../infrastructure/database/model/DatingProfileMode";


class UserService {
    async findEmailWithUserId(userId: Types.ObjectId) {
        console.log("retreo", userId);

        const user = await UserModel.findById(userId)
        const email = user?.email
        console.log("email", email);
        return email


    }
    async findUserIdWithEmail(email: Types.ObjectId) {
        console.log("retreo", email);

        const user = await UserModel.findOne({ email: email })
        const userId = user?._id
        console.log("userId", userId);
        return userId


    }
    async findUserDetailsWithEmail(email: string) {
        const user = await UserModel.findOne({ email })
        return user
    }
    async findUserDetails(userId: Types.ObjectId) {
        const user = await UserModel.findById(userId)
        return user
    }
    async findDatingProfile(userId: Types.ObjectId) {
        const user = await DatingProfile.findOne({ userId })
        return user
    }
}

export default new UserService() 