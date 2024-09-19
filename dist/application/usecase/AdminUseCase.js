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
            return this._repository.getPremiumPaymentDetails();
        });
    }
    fetchUserDetailsByRoles(roles) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._repository.getUserDetailsByRoles(roles);
        });
    }
    blockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._repository.findByIdAndUpdate(userId, { isBlocked: true });
            if (!user) {
                throw new Error('User not found');
            }
        });
    }
    getTotalRevenueForPeriod(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._repository.calculateTotalRevenue(startDate, endDate);
        });
    }
    unblockUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this._repository.findByIdAndUpdate(userId, { isBlocked: false });
            if (!user) {
                throw new Error('User not found');
            }
        });
    }
    getBlockedUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const blockedUsers = yield this._repository.findBlockedUsers();
            return blockedUsers.map(user => user._id);
        });
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            return this._repository.findReportsByActionTaken(false);
        });
    }
    banPost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const post = yield this._repository.findPostById(postId);
            if (post) {
                post.isBanned = true;
                yield post.save();
            }
        });
    }
}
exports.AdminUseCase = AdminUseCase;
