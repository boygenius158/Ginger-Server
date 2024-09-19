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
class AdminRepository {
    getPremiumPaymentDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            return PremiumModel_1.PremiumModel.aggregate([
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
        });
    }
    getUserDetailsByRoles(roles) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.default.find({ roles: { $in: roles } });
        });
    }
    calculateTotalRevenue(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
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
        });
    }
    findByIdAndUpdate(userId, update) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.default.findByIdAndUpdate(userId, update, { new: true });
        });
    }
    findBlockedUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            return UserModel_1.default.find({ isBlocked: true }).select('_id').exec();
        });
    }
    findReportsByActionTaken(actionTaken) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(actionTaken, "poiuu");
            return ReportModel_1.default.find({ actionTaken }).populate({
                path: 'postId',
                populate: {
                    path: 'userId'
                }
            }).exec(); // Use exec() to get a promise
        });
    }
    findPostById(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            return PostModel_1.PostModel.findById(postId).exec();
        });
    }
}
exports.AdminRepository = AdminRepository;
