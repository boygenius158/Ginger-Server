import { NextFunction, Request, Response } from "express";
import { IAdminUseCase } from "../../application/usecase/AdminUseCase";
import { HttpStatus } from "../../utils/HttpStatus";
import { CustomRequest } from "../../application/interface/CustomRequest";

export class AdminController {
    private _adminUseCase: IAdminUseCase

    constructor(adminUseCase: IAdminUseCase) {
        this._adminUseCase = adminUseCase
    }
    async fetchPremiumPaymentDetails(req: CustomRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                throw new Error
            }
            if (req.user.roles !== 'admin') {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }
            const data = await this._adminUseCase.fetchPremiumPaymentDetails();
            res.json(data);
        } catch (error) {
            console.error('Error fetching premium payment details:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }
    async fetchUserDetailsByRoles(req: CustomRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                throw new Error
            }
            if (req.user.roles !== 'admin') {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }
            const roles = ['user', 'premium']; // Roles to filter
            const userDetails = await this._adminUseCase.fetchUserDetailsByRoles(roles);
            res.json({ userDetails });
        } catch (error) {
            console.error('Error fetching user details:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Internal Server Error');
        }
    }
    async blockUser(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            if (!userId) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }
            if (!req.user) {
                throw new Error
            }
            if (req.user.roles !== 'admin') {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }
            await this._adminUseCase.blockUser(userId);
            res.json({ message: 'User blocked successfully' });
        } catch (error) {
            console.error('Error blocking user:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async getTotalRevenue(req: CustomRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                throw new Error
            }
            if (req.user.roles !== 'admin') {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }
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

    async unblockUser(req: CustomRequest, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            if (!userId) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }
            if (!req.user) {
                throw new Error
            }
            if (req.user.roles !== 'admin') {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }
            await this._adminUseCase.unblockUser(userId);
            res.json({ message: 'User unblocked successfully' });
        } catch (error) {
            console.error('Error unblocking user:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async getBlockedUsers(req: CustomRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                throw new Error
            }
            if (req.user.roles !== 'admin') {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }
            const blockedUserIds = await this._adminUseCase.getBlockedUsers();
            res.json({ blockedUserIds });
        } catch (error) {
            console.error('Error fetching blocked users:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async handle(req: CustomRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                throw new Error
            }
            if (req.user.roles !== 'admin') {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }
            const posts = await this._adminUseCase.execute();
            console.log(posts, "po0999");

            res.json({ posts });
        } catch (error) {
            console.error('Error in filterPostController:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal Server Error' });
        }
    }
    async banPost(req: CustomRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                throw new Error
            }
            if (req.user.roles !== 'admin') {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }
            const { postId } = req.body;
            await this._adminUseCase.banPost(postId);
            res.json({});
        } catch (error) {
            console.error('Error banning post:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async userDemoInfo(req: CustomRequest, res: Response): Promise<any> {
        try {
            if (!req.user) {
                throw new Error
            }
            if (req.user.roles !== 'admin') {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }
            const responseData = await this._adminUseCase.userDemoInfo()
            return responseData
        } catch (error) {
            console.error('Error getting user info:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async banPostUser(req: CustomRequest, res: Response): Promise<void> {
        try {
            if (!req.user) {
                throw new Error
            }
            if (req.user.roles !== 'admin') {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }
            const { postId } = req.body

            const response = await this._adminUseCase.banPostUser(postId)
            res.json({})
        } catch (error) {
            console.error('Error banning post:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async isPostSaved(req: CustomRequest, res: Response): Promise<any> {
        try {
            
            // const { userId } = req.body
            if(!req.user){
                return res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }
            const userId = req.user.id
            const user = await this._adminUseCase.isPostSaved(userId)
            console.log(user, "poi");

            res.json({ user })
        } catch (error) {
            console.error(`Error isPostSaved:`, error);
            throw new Error('Failed');
        }
    }
    async filterPost(req: CustomRequest, res: Response): Promise<any> {
        try {
            if (!req.user) {
                throw new Error
            }
            if (req.user.roles !== 'admin') {
                res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }
            const posts = await this._adminUseCase.filterPost()
            res.json({ posts })
        } catch (error) {
            console.error(`Error isPostSaved:`, error);
            throw new Error('Failed');
        }
    }
}
