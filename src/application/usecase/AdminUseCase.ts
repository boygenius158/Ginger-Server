import UserModel from "../../infrastructure/database/model/UserModel";
import { IAdminRepository } from "../../infrastructure/repository/AdminRepository"


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
    private _repository: IAdminRepository
    constructor(_repository: IAdminRepository) {
        this._repository = _repository
    }
    async fetchPremiumPaymentDetails(): Promise<any[]> {
        return this._repository.getPremiumPaymentDetails();
    }
    async fetchUserDetailsByRoles(roles: string[]): Promise<any[]> {
        return this._repository.getUserDetailsByRoles(roles);
    }
    async blockUser(userId: string): Promise<void> {
        const user = await this._repository.findByIdAndUpdate(userId, { isBlocked: true });
        if (!user) {
            throw new Error('User not found');
        }
    }
    async getTotalRevenueForPeriod(startDate: Date, endDate: Date): Promise<number> {
        return this._repository.calculateTotalRevenue(startDate, endDate);
    }
    async unblockUser(userId: string): Promise<void> {
        const user = await this._repository.findByIdAndUpdate(userId, { isBlocked: false });
        if (!user) {
            throw new Error('User not found');
        }
    }
    async getBlockedUsers(): Promise<any[]> {
        const blockedUsers = await this._repository.findBlockedUsers();
        return blockedUsers.map(user => user._id);
    }
    async execute(): Promise<any[]> {
        return this._repository.findReportsByActionTaken(false);
    }
    async banPost(postId: string): Promise<void> {
        const post = await this._repository.findPostById(postId);
        if (post) {
            post.isBanned = true;
            await post.save();
        }
    }
}