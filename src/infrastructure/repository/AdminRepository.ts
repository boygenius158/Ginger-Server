import UserModel from "../database/model/UserModel";
import { PostModel } from "../database/model/PostModel";
import { PremiumModel } from "../database/model/PremiumModel";
import Report from "../database/model/ReportModel";

export interface IAdminRepository {
    getPremiumPaymentDetails(): Promise<any[]>;
    getUserDetailsByRoles(roles: string[]): Promise<any[]>;
    findByIdAndUpdate(userId: string, update: any): Promise<any>;
    calculateTotalRevenue(startDate: Date, endDate: Date): Promise<number>;
    findByIdAndUpdate(userId: string, update: any): Promise<any>;
    findBlockedUsers(): Promise<any[]>;
    findReportsByActionTaken(actionTaken: boolean): Promise<any[]>;

    findPostById(postId: string): Promise<any>;
}



export class AdminRepository implements IAdminRepository {
    async getPremiumPaymentDetails(): Promise<any[]> {
        return PremiumModel.aggregate([
            {
                $lookup: {
                    from: 'users', // The collection name in MongoDB for the User model
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            {
                $unwind: '$userDetails' // Deconstructs the array to output one document per element
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field if not needed
                    username: '$userDetails.username',
                    email: '$userDetails.email',
                    profilePicture: '$userDetails.profilePicture',
                    amount: 1
                }
            }
        ]);
    }
    async getUserDetailsByRoles(roles: string[]): Promise<any[]> {
        return UserModel.find({ roles: { $in: roles } });
    }
    
    async calculateTotalRevenue(startDate: Date, endDate: Date): Promise<number> {
        const result = await PremiumModel.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: startDate,
                        $lte: endDate,
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$amount' },
                },
            },
        ]);

        return result.length > 0 ? result[0].totalRevenue : 0;
    }
    async findByIdAndUpdate(userId: string, update: any): Promise<any> {
        return UserModel.findByIdAndUpdate(userId, update, { new: true });
    }
    async findBlockedUsers(): Promise<any[]> {
        return UserModel.find({ isBlocked: true }).select('_id').exec();
    }
    async findReportsByActionTaken(actionTaken: boolean): Promise<any[]> {
        
        return Report.find({ actionTaken }).populate({
            path: 'postId',
            populate: {
                path: 'userId'
            }
        }).exec(); // Use exec() to get a promise
    }

    async findPostById(postId: string): Promise<any> {
        return PostModel.findById(postId).exec();
    }
}