"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const UserModel_1 = __importDefault(require("../database/model/UserModel"));
const PostModel_1 = require("../database/model/PostModel");
const PremiumModel_1 = require("../database/model/PremiumModel");
const ReportModel_1 = __importDefault(require("../database/model/ReportModel"));
// export interface IAdminRepository {
//     getPremiumPaymentDetails(): Promise<any[]>;
//     getUserDetailsByRoles(roles: string[]): Promise<any[]>;
//     findByIdAndUpdate(userId: string, update: any): Promise<any>;
//     calculateTotalRevenue(startDate: Date, endDate: Date): Promise<number>;
//     findBlockedUsers(): Promise<any[]>;
//     findReportsByActionTaken(actionTaken: boolean): Promise<any[]>;
//     findPostById(postId: string): Promise<any>;
// }
class AdminRepository {
    getPremiumPaymentDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield PremiumModel_1.PremiumModel.aggregate([
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
            }
            catch (error) {
                console.error('Error fetching premium payment details:', error);
                throw new Error('Failed to fetch premium payment details');
            }
        });
    }
    getUserDetailsByRoles(roles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel_1.default.find({ roles: { $in: roles } });
            }
            catch (error) {
                console.error('Error fetching user details by roles:', error);
                throw new Error('Failed to fetch user details by roles');
            }
        });
    }
    calculateTotalRevenue(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield PremiumModel_1.PremiumModel.aggregate([
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
            catch (error) {
                console.error('Error calculating total revenue:', error);
                throw new Error('Failed to calculate total revenue');
            }
        });
    }
    findByIdAndUpdate(userId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel_1.default.findByIdAndUpdate(userId, update, { new: true });
            }
            catch (error) {
                console.error(`Error updating user with ID ${userId}:`, error);
                throw new Error('Failed to update user');
            }
        });
    }
    findBlockedUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield UserModel_1.default.find({ isBlocked: true }).select('_id').exec();
            }
            catch (error) {
                console.error('Error fetching blocked users:', error);
                throw new Error('Failed to fetch blocked users');
            }
        });
    }
    findReportsByActionTaken(actionTaken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield ReportModel_1.default.find({}).populate({
                    path: 'postId',
                    populate: {
                        path: 'userId'
                    }
                })
                    .sort({ createdAt: -1 })
                    .exec();
            }
            catch (error) {
                console.error('Error fetching reports by action taken:', error);
                throw new Error('Failed to fetch reports');
            }
        });
    }
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield PostModel_1.PostModel.findById(postId).exec();
            }
            catch (error) {
                console.error(`Error fetching post with ID ${postId}:`, error);
                throw new Error('Failed to fetch post');
            }
        });
    }
    banPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield PostModel_1.PostModel.findByIdAndDelete(postId);
            }
            catch (error) {
                console.error(`Error fetching post with ID ${postId}:`, error);
                throw new Error('Failed to fetch post');
            }
        });
    }
    userDemoInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const counts = yield UserModel_1.default.aggregate([
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
                return responseData;
            }
            catch (error) {
                console.error(`Error fetching post with ID :`, error);
                throw new Error('Failed to fetch post');
            }
        });
    }
    banPostUser(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // Delete the post with the specified postId
                const response = yield PostModel_1.PostModel.findByIdAndDelete(postId);
                // Delete all reports with the specified postId
                const reportResponse = yield ReportModel_1.default.deleteMany({ postId: postId });
                return response;
            }
            catch (error) {
                console.error(`Error banning user:`, error);
                throw new Error('Failed');
            }
        });
    }
    isPostSaved(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield UserModel_1.default.findById(userId);
                console.log(user, "oio");
                return user;
            }
            catch (error) {
                console.error(`Error isPostSaved:`, error);
                throw new Error('Failed');
            }
        });
    }
    filterPost() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield ReportModel_1.default.find({}).populate({
                    path: 'postId',
                    populate: {
                        path: 'userId'
                    }
                })
                    .sort({ createdAt: -1 })
                    .exec();
                console.log(posts, "h");
                return posts;
            }
            catch (error) {
                console.error(`Error filterPost:`, error);
                throw new Error('Failed');
            }
        });
    }
}
exports.AdminRepository = AdminRepository;
