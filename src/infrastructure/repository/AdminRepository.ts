import UserModel from "../database/model/UserModel";
import { PostModel } from "../database/model/PostModel";
import { PremiumModel } from "../database/model/PremiumModel";
import Report from "../database/model/ReportModel";
import { IAdminRepository } from "../../application/interface/IAdminRepository";

// export interface IAdminRepository {
//     getPremiumPaymentDetails(): Promise<any[]>;
//     getUserDetailsByRoles(roles: string[]): Promise<any[]>;
//     findByIdAndUpdate(userId: string, update: any): Promise<any>;
//     calculateTotalRevenue(startDate: Date, endDate: Date): Promise<number>;
//     findBlockedUsers(): Promise<any[]>;
//     findReportsByActionTaken(actionTaken: boolean): Promise<any[]>;
//     findPostById(postId: string): Promise<any>;
// }

export class AdminRepository implements IAdminRepository {

    async getPremiumPaymentDetails(): Promise<any[]> {
        try {
            return await PremiumModel.aggregate([
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                {
                    $unwind: '$userDetails'
                },
                {
                    $project: {
                        _id: 0,
                        username: '$userDetails.username',
                        email: '$userDetails.email',
                        profilePicture: '$userDetails.profilePicture',
                        amount: 1
                    }
                }
            ]);
        } catch (error) {
            console.error('Error fetching premium payment details:', error);
            throw new Error('Failed to fetch premium payment details');
        }
    }

    async getUserDetailsByRoles(roles: string[]): Promise<any[]> {
        try {
            return await UserModel.find({ roles: { $in: roles } });
        } catch (error) {
            console.error('Error fetching user details by roles:', error);
            throw new Error('Failed to fetch user details by roles');
        }
    }

    async calculateTotalRevenue(startDate: Date, endDate: Date): Promise<number> {
        try {
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
        } catch (error) {
            console.error('Error calculating total revenue:', error);
            throw new Error('Failed to calculate total revenue');
        }
    }

    async findByIdAndUpdate(userId: string, update: any): Promise<any> {
        try {
            return await UserModel.findByIdAndUpdate(userId, update, { new: true });
        } catch (error) {
            console.error(`Error updating user with ID ${userId}:`, error);
            throw new Error('Failed to update user');
        }
    }

    async findBlockedUsers(): Promise<any[]> {
        try {
            return await UserModel.find({ isBlocked: true }).select('_id').exec();
        } catch (error) {
            console.error('Error fetching blocked users:', error);
            throw new Error('Failed to fetch blocked users');
        }
    }

    async findReportsByActionTaken(actionTaken: boolean): Promise<any[]> {
        try {
            return await Report.find({ actionTaken }).populate({
                path: 'postId',
                populate: {
                    path: 'userId'
                }
            })
                .sort({ createdAt: -1 })
                .exec();
        } catch (error) {
            console.error('Error fetching reports by action taken:', error);
            throw new Error('Failed to fetch reports');
        }
    }

    async findPostById(postId: string): Promise<any> {
        try {
            return await PostModel.findById(postId).exec();
        } catch (error) {
            console.error(`Error fetching post with ID ${postId}:`, error);
            throw new Error('Failed to fetch post');
        }
    }
}
