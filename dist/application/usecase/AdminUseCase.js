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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminUseCase = void 0;
class AdminUseCase {
    constructor(_repository) {
        this._repository = _repository;
    }
    fetchPremiumPaymentDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repository.getPremiumPaymentDetails();
            }
            catch (error) {
                console.error("Failed to fetch premium payment details:", error);
                throw new Error("Could not fetch premium payment details");
            }
        });
    }
    fetchUserDetailsByRoles(roles) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repository.getUserDetailsByRoles(roles);
            }
            catch (error) {
                console.error("Failed to fetch user details by roles:", error);
                throw new Error("Could not fetch user details by roles");
            }
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._repository.findByIdAndUpdate(userId, { isBlocked: true });
                if (!user) {
                    throw new Error('User not found');
                }
            }
            catch (error) {
                console.error("Error blocking user:", error);
                throw new Error("Could not block user: " + error);
            }
        });
    }
    getTotalRevenueForPeriod(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repository.calculateTotalRevenue(startDate, endDate);
            }
            catch (error) {
                console.error("Failed to calculate total revenue:", error);
                throw new Error("Could not calculate total revenue for the specified period");
            }
        });
    }
    unblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield this._repository.findByIdAndUpdate(userId, { isBlocked: false });
                if (!user) {
                    throw new Error('User not found');
                }
            }
            catch (error) {
                console.error("Error unblocking user:", error);
                throw new Error("Could not unblock user: " + error);
            }
        });
    }
    getBlockedUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blockedUsers = yield this._repository.findBlockedUsers();
                return blockedUsers.map(user => user._id);
            }
            catch (error) {
                console.error("Failed to get blocked users:", error);
                throw new Error("Could not fetch blocked users");
            }
        });
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this._repository.findReportsByActionTaken(false);
            }
            catch (error) {
                console.error("Error executing reports:", error);
                throw new Error("Could not execute reports");
            }
        });
    }
    banPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const post = yield this._repository.findPostById(postId);
                if (post) {
                    post.isBanned = true;
                    yield post.save();
                }
                else {
                    throw new Error("Post not found");
                }
            }
            catch (error) {
                console.error("Error banning post:", error);
                throw new Error("Could not ban post: " + error);
            }
        });
    }
}
exports.AdminUseCase = AdminUseCase;
