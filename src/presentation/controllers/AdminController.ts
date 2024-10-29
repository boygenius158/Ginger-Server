import { NextFunction, Request, Response } from "express";
import { IAdminUseCase } from "../../application/usecase/AdminUseCase";
import { HttpStatus } from "../../utils/HttpStatus";

export class AdminController {
    private _adminUseCase: IAdminUseCase

    constructor(adminUseCase: IAdminUseCase) {
        this._adminUseCase = adminUseCase
    }
    async fetchPremiumPaymentDetails(req: Request, res: Response): Promise<void> {
        try {
            const data = await this._adminUseCase.fetchPremiumPaymentDetails();
            res.json(data);
        } catch (error) {
            console.error('Error fetching premium payment details:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }
    async fetchUserDetailsByRoles(req: Request, res: Response): Promise<void> {
        try {
            const roles = ['user', 'premium']; // Roles to filter
            const userDetails = await this._adminUseCase.fetchUserDetailsByRoles(roles);
            res.json({ userDetails });
        } catch (error) {
            console.error('Error fetching user details:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }
    async blockUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            if (!userId) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }

            await this._adminUseCase.blockUser(userId);
            res.json({ message: 'User blocked successfully' });
        } catch (error) {
            console.error('Error blocking user:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async getTotalRevenue(req: Request, res: Response): Promise<void> {
        try {
            const currentDate = new Date();
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(currentDate.getDate() - 30);

            const totalRevenue = await this._adminUseCase.getTotalRevenueForPeriod(
                thirtyDaysAgo,
                currentDate
            );

            res.json({ totalRevenue });
            console.log("Total revenue for the past 30 days:", totalRevenue);
        } catch (error) {
            console.error("Error calculating total revenue:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        }
    }

    async unblockUser(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            if (!userId) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }

            await this._adminUseCase.unblockUser(userId);
            res.json({ message: 'User unblocked successfully' });
        } catch (error) {
            console.error('Error unblocking user:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async getBlockedUsers(req: Request, res: Response): Promise<void> {
        try {
            const blockedUserIds = await this._adminUseCase.getBlockedUsers();
            res.json({ blockedUserIds });
        } catch (error) {
            console.error('Error fetching blocked users:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async handle(req: Request, res: Response): Promise<void> {
        try {
            const posts = await this._adminUseCase.execute();
            console.log(posts, "po0999");

            res.json({ posts });
        } catch (error) {
            console.error('Error in filterPostController:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
        }
    }
    async banPost(req: Request, res: Response): Promise<void> {
        try {
            const { postId } = req.body;
            await this._adminUseCase.banPost(postId);
            res.json({});
        } catch (error) {
            console.error('Error banning post:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async userDemoInfo(req: Request, res: Response): Promise<any> {
        try {
            const responseData = this._adminUseCase.userDemoInfo()
            return responseData
        } catch (error) {
            console.error('Error getting user info:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async banPostUser(req: Request, res: Response): Promise<void> {
        try {
            const { postId } = req.body

            const response = this._adminUseCase.banPostUser(postId)
            res.json({})
        } catch (error) {
            console.error('Error banning post:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async isPostSaved(req: Request, res: Response): Promise<any> {
        try {
            const { userId } = req.body
            const user = this._adminUseCase.isPostSaved(userId)
            return user
        } catch (error) {
            console.error(`Error isPostSaved:`, error);
            throw new Error('Failed');
        }
    }
    async filterPost(req: Request, res: Response): Promise<any> {
        try {
            const posts = this._adminUseCase.filterPost()
            return posts
        } catch (error) {
            console.error(`Error isPostSaved:`, error);
            throw new Error('Failed');
        }
    }
}
