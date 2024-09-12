import { NextFunction, Request, Response } from "express";
import { IAdminUseCase } from "../../application/usecase/AdminUseCase";

export class AdminController {
    private adminUseCase: IAdminUseCase

    constructor(adminUseCase: IAdminUseCase) {
        this.adminUseCase = adminUseCase
    }
    async fetchPremiumPaymentDetails(req: Request, res: Response): Promise<void> {
        try {
            const data = await this.adminUseCase.fetchPremiumPaymentDetails();
            res.json(data);
        } catch (error) {
            console.error('Error fetching premium payment details:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    async fetchUserDetailsByRoles(req: Request, res: Response): Promise<void> {
        try {
            const roles = ['user', 'premium']; // Roles to filter
            const userDetails = await this.adminUseCase.fetchUserDetailsByRoles(roles);
            res.json({ userDetails });
        } catch (error) {
            console.error('Error fetching user details:', error);
            res.status(500).send('Internal Server Error');
        }
    }
    async blockUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
            }

            await this.adminUseCase.blockUser(userId);
            res.json({ message: 'User blocked successfully' });
        } catch (error) {
            console.error('Error blocking user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getTotalRevenue(req: Request, res: Response): Promise<void> {
        try {
            const currentDate = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(currentDate.getDate() - 30);

            const totalRevenue = await this.adminUseCase.getTotalRevenueForPeriod(
                thirtyDaysAgo,
                currentDate
            );

            res.json({ totalRevenue });
            console.log("Total revenue for the past 30 days:", totalRevenue);
        } catch (error) {
            console.error("Error calculating total revenue:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }

    async unblockUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            if (!userId) {
                res.status(400).json({ error: 'User ID is required' });
            }

            await this.adminUseCase.unblockUser(userId);
            res.json({ message: 'User unblocked successfully' });
        } catch (error) {
            console.error('Error unblocking user:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async getBlockedUsers(req: Request, res: Response): Promise<void> {
        try {
            const blockedUserIds = await this.adminUseCase.getBlockedUsers();
            res.json({ blockedUserIds });
        } catch (error) {
            console.error('Error fetching blocked users:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async handle(req: Request, res: Response): Promise<void> {
        try {
            const posts = await this.adminUseCase.execute();
            console.log(posts,"po0999");
            
            res.json({ posts });
        } catch (error) {
            console.error('Error in filterPostController:', error);
            res.status(500).json({ message: 'Internal Server Error' });
        }
    }
    async banPost(req: Request, res: Response): Promise<void> {
        try {
            const { postId } = req.body;
            await this.adminUseCase.banPost(postId);
            res.json({});
        } catch (error) {
            console.error('Error banning post:', error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}