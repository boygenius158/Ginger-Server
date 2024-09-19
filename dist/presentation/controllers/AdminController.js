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
exports.AdminController = void 0;
class AdminController {
    constructor(adminUseCase) {
        this.adminUseCase = adminUseCase;
    }
    fetchPremiumPaymentDetails(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield this.adminUseCase.fetchPremiumPaymentDetails();
                res.json(data);
            }
            catch (error) {
                console.error('Error fetching premium payment details:', error);
                res.status(500).send('Internal Server Error');
            }
        });
    }
    fetchUserDetailsByRoles(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const roles = ['user', 'premium']; // Roles to filter
                const userDetails = yield this.adminUseCase.fetchUserDetailsByRoles(roles);
                res.json({ userDetails });
            }
            catch (error) {
                console.error('Error fetching user details:', error);
                res.status(500).send('Internal Server Error');
            }
        });
    }
    blockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                if (!userId) {
                    res.status(400).json({ error: 'User ID is required' });
                }
                yield this.adminUseCase.blockUser(userId);
                res.json({ message: 'User blocked successfully' });
            }
            catch (error) {
                console.error('Error blocking user:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    getTotalRevenue(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const currentDate = new Date();
                const thirtyDaysAgo = new Date();
                thirtyDaysAgo.setDate(currentDate.getDate() - 30);
                const totalRevenue = yield this.adminUseCase.getTotalRevenueForPeriod(thirtyDaysAgo, currentDate);
                res.json({ totalRevenue });
                console.log("Total revenue for the past 30 days:", totalRevenue);
            }
            catch (error) {
                console.error("Error calculating total revenue:", error);
                res.status(500).json({ error: "Internal Server Error" });
            }
        });
    }
    unblockUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.body;
                if (!userId) {
                    res.status(400).json({ error: 'User ID is required' });
                }
                yield this.adminUseCase.unblockUser(userId);
                res.json({ message: 'User unblocked successfully' });
            }
            catch (error) {
                console.error('Error unblocking user:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    getBlockedUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const blockedUserIds = yield this.adminUseCase.getBlockedUsers();
                res.json({ blockedUserIds });
            }
            catch (error) {
                console.error('Error fetching blocked users:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
    handle(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const posts = yield this.adminUseCase.execute();
                console.log(posts, "po0999");
                res.json({ posts });
            }
            catch (error) {
                console.error('Error in filterPostController:', error);
                res.status(500).json({ message: 'Internal Server Error' });
            }
        });
    }
    banPost(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { postId } = req.body;
                yield this.adminUseCase.banPost(postId);
                res.json({});
            }
            catch (error) {
                console.error('Error banning post:', error);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        });
    }
}
exports.AdminController = AdminController;
