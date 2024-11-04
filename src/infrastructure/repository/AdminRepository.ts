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
            return await Report.find({}).populate({
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
    async banPost(postId: string): Promise<any> {
        try {
            await PostModel.findByIdAndDelete(postId)

        } catch (error) {
            console.error(`Error fetching post with ID ${postId}:`, error);
            throw new Error('Failed to fetch post');
        }
    }

    async userDemoInfo(): Promise<any> {
        try {
            const counts = await UserModel.aggregate([
                {
                    $match: {
                        roles: { $in: ['user', 'premium'] } // Include only user and premium roles
                    }
                },
                {
                    $group: {
                        _id: '$roles', // Group by the roles
                        count: { $sum: 1 } // Count each role
                    }
                }
            ]);

            // Format the response data
            const responseData = counts.map(roleCount => ({
                label: roleCount._id,
                value: roleCount.count
            }));

            return responseData

        } catch (error) {
            console.error(`Error fetching post with ID :`, error);
            throw new Error('Failed to fetch post');
        }
    }
    async banPostUser(postId: string): Promise<any> {
        try {
            // Delete the post with the specified postId
            const response = await PostModel.findByIdAndDelete(postId);

            // Delete all reports with the specified postId
            const reportResponse = await Report.deleteMany({ postId: postId });

            return response

        } catch (error) {
            console.error(`Error banning user:`, error);
            throw new Error('Failed');
        }
    }

    async isPostSaved(userId: string): Promise<any> {
        try {
            const user = await UserModel.findById(userId)
            console.log(user,"oio");
            
            return user
        } catch (error) {
            console.error(`Error isPostSaved:`, error);
            throw new Error('Failed');
        }
    }
    async filterPost(): Promise<any> {
        try {
            const posts = await Report.find({}).populate({
                path: 'postId',
                populate: {
                    path: 'userId'
                }
            })
                .sort({ createdAt: -1 })
                .exec();
            console.log(posts, "h");

            return posts
        } catch (error) {
            console.error(`Error filterPost:`, error);
            throw new Error('Failed');
        }
    }



}
