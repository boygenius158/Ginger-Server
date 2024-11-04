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
    userDemoInfo(): Promise<any>
    banPostUser(postId: string): Promise<any>
    isPostSaved(userId: string): Promise<any>
    filterPost():Promise<any>
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
            throw new Error("Could not unblock user: " + error);
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
            const post = await this._repository.banPost(postId);
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
    async userDemoInfo(): Promise<any> {
        try {
            const responseData = await this._repository.userDemoInfo()
            return responseData
        } catch (error) {
            console.error("Error userDemoInof:", error);
            throw new Error("Could not get user: " + error);
        }
    }
    async banPostUser(postId: string): Promise<any> {
        try {
            const response = await this._repository.banPostUser(postId)
        } catch (error) {
            console.error("Error banning post:", error);
            throw new Error("Could not ban post: " + error);
        }
    }
    async isPostSaved(userId: string): Promise<any> {
        try {
            const user = await this._repository.isPostSaved(userId)
            return user
        } catch (error) {
            console.error(`Error isPostSaved:`, error);
            throw new Error('Failed');
        }
    }
    async filterPost(): Promise<any> {
        try {
            const posts = await this._repository.filterPost()
            return posts
        } catch (error) {
            console.error(`Error filterPost:`, error);
            throw new Error('Failed');
        }
    }

}
