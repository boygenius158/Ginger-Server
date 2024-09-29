import UserModel from "../../infrastructure/database/model/UserModel";
import { IAdminRepository } from "../interface/IAdminRepository";
// import { IAdminRepository } from "../../infrastructure/repository/AdminRepository";

export interface IAdminUseCase {
    fetchPremiumPaymentDetails(): Promise<any[]>;
    fetchUserDetailsByRoles(roles: string[]): Promise<any[]>;
    blockUser(userId: string): Promise<void>;
    getTotalRevenueForPeriod(startDate: Date, endDate: Date): Promise<number>;
    unblockUser(userId: string): Promise<void>;
    getBlockedUsers(): Promise<any[]>;
    execute(): Promise<any[]>;
    banPost(postId: string): Promise<void>;
}

export class AdminUseCase implements IAdminUseCase {
    private _repository: IAdminRepository;

    constructor(_repository: IAdminRepository) {
        this._repository = _repository;
    }

    async fetchPremiumPaymentDetails(): Promise<any[]> {
        try {
            return await this._repository.getPremiumPaymentDetails();
        } catch (error) {
            console.error("Failed to fetch premium payment details:", error);
            throw new Error("Could not fetch premium payment details");
        }
    }

    async fetchUserDetailsByRoles(roles: string[]): Promise<any[]> {
        try {
            return await this._repository.getUserDetailsByRoles(roles);
        } catch (error) {
            console.error("Failed to fetch user details by roles:", error);
            throw new Error("Could not fetch user details by roles");
        }
    }

    async blockUser(userId: string): Promise<void> {
        try {
            const user = await this._repository.findByIdAndUpdate(userId, { isBlocked: true });
            if (!user) {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error("Error blocking user:", error);
            throw new Error("Could not block user: " + error);
        }
    }

    async getTotalRevenueForPeriod(startDate: Date, endDate: Date): Promise<number> {
        try {
            return await this._repository.calculateTotalRevenue(startDate, endDate);
        } catch (error) {
            console.error("Failed to calculate total revenue:", error);
            throw new Error("Could not calculate total revenue for the specified period");
        }
    }

    async unblockUser(userId: string): Promise<void> {
        try {
            const user = await this._repository.findByIdAndUpdate(userId, { isBlocked: false });
            if (!user) {
                throw new Error('User not found');
            }
        } catch (error) {
            console.error("Error unblocking user:", error);
            throw new Error("Could not unblock user: " + error  );
        }
    }

    async getBlockedUsers(): Promise<any[]> {
        try {
            const blockedUsers = await this._repository.findBlockedUsers();
            return blockedUsers.map(user => user._id);
        } catch (error) {
            console.error("Failed to get blocked users:", error);
            throw new Error("Could not fetch blocked users");
        }
    }

    async execute(): Promise<any[]> {
        try {
            return await this._repository.findReportsByActionTaken(false);
        } catch (error) {
            console.error("Error executing reports:", error);
            throw new Error("Could not execute reports");
        }
    }

    async banPost(postId: string): Promise<void> {
        try {
            const post = await this._repository.findPostById(postId);
            if (post) {
                post.isBanned = true;
                await post.save();
            } else {
                throw new Error("Post not found");
            }
        } catch (error) {
            console.error("Error banning post:", error);
            throw new Error("Could not ban post: " + error);
        }
    }
}
