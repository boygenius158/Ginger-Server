import { Request, Response, NextFunction } from 'express'; // Import necessary types from Express
import { IAuthUseCase } from '../../application/interface/IUserUsecase'; // Import the interface
import { TokenGenerator } from '../../utils/tokenGenerator';
import randomnumber from '../../utils/randomOTP';
import { UserRole } from '../../domain/entities/User';
// import { UserModel } from '../../infrastructure/database/model/authModel';
export class authController {
    private authUsecase: IAuthUseCase;
    private tokenGenerator: TokenGenerator;

    constructor(authUsecase: IAuthUseCase) {
        this.authUsecase = authUsecase;
        this.tokenGenerator = new TokenGenerator();
    }

    async signUpUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const userExists = await this.authUsecase.userExists(email);
            if (!userExists) {
                const userData = await this.authUsecase.registerUser(req.body);
                console.log(userData, "990099");

                return res.json(userData);
            }
            return res.json({ success: false, message: "User already exists" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async loginUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.authUsecase.userExists(req.body.email);
            if (!user) {
                return res.status(401).json({ error: "User not found" });
            }
            // console.log(user,"{{{");

            const user2 = await this.authUsecase.verifyPassword(req.body.email, req.body.password);
            // console.log("user",user2);
            console.log(user2, "popo");

            return res.json(user2);
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async googleAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.authUsecase.userExists(req.body.email);
            if (user) {
                return res.json(user);
            } else {
                console.log("0099");

                const newUser = await this.authUsecase.registerUser(req.body);
                return res.json(newUser);
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async forgetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this.authUsecase.userExists(req.body.email);
            if (user) {
                await this.authUsecase.forgotPassword(user.email);
                return res.json({ success: true, message: "Email has been sent" });
            } else {
                return res.json({ success: false, message: "User doesn't exist" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, password } = req.body;
            const secretKey = "nibla158";

            const decodedToken = this.tokenGenerator.verifyToken(token, secretKey);
            if (!decodedToken) {
                return res.status(401).json({ error: "Invalid or expired token" });
            }

            await this.authUsecase.changePassword(decodedToken.email, password);
            return res.json({ success: true, message: "Password changed successfully" });
        } catch (error) {
            console.error("Error in changePassword:", error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async checkRole(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("check role", req.body);

            const user = await this.authUsecase.userExists(req.body.email);
            // console.log(user);

            if (!user) {
                return res.status(404).json({ success: false, message: "User not found" });
            }
            const userRole = await this.authUsecase.getUserRole(req.body.email);
            console.log("Ds", userRole, "sd");

            if (userRole) {
                return res.json({ success: true, role: userRole });
            } else {
                return res.status(403).json({ success: false, message: "User does not have a role" });
            }
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async generateotp(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const otp = await randomnumber();
            await this.authUsecase.storeotp(otp, email);
            return res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async verifyotp(req: Request, res: Response, next: NextFunction) {
        try {
            await this.authUsecase.verifyotp(req.body.otp, req.body.email);
            return res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async clearotp(req: Request, res: Response, next: NextFunction) {
        try {
            await this.authUsecase.clearotp(req.body.email);
            return res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async uploadProfile(req: Request, res: Response): Promise<void> {
        try {
            const { url, userId } = req.body;
            const updatedUser = await this.authUsecase.uploadProfilePicture(userId, url);
            res.json({ url: updatedUser.profilePicture });
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async searchUser(req: Request, res: Response): Promise<void> {
        try {
            const searchQuery = req.query.searchQuery as string;
            if (!searchQuery) {
                res.status(400).json({ error: "Search query is required" });
            }
            const users = await this.authUsecase.searchUsers(searchQuery);
            res.json({ users });
        } catch (error) {
            console.error("Error searching users:", error);
            res.status(500).json({ error: "Internal Server Error" });
        }
    }
    async fetchNameUsername(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.authUsecase.getUserById(req.body.id);
            if (!user) {
                res.status(404).json({ error: 'User not found' });
            } else {
                res.json({ user });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    async hasPassword(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const result = await this.authUsecase.hasPassword(id);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const { id, name, username } = req.body;
            const result = await this.authUsecase.updateUser(id, name, username);
            if (result.success === false) {
                res.json(result);
            } else {
                res.json({ success: true, user: result });
            }
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    async updatePassword(req: Request, res: Response): Promise<void> {
        try {
            const { id, currentPassword, newPassword } = req.body;
            const result = await this.authUsecase.updatePassword(id, currentPassword, newPassword);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }
    async miniProfile(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.authUsecase.getMiniProfile(req.body.id);
            res.json({ user });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    async saveUserToSearchHistory(req: Request, res: Response): Promise<void> {
        try {
            const result = await this.authUsecase.saveUserToSearchHistory(req.body.userId, req.body.key);
            res.json(result);
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    async getRecentSearches(req: Request, res: Response): Promise<void> {
        try {
            const searches = await this.authUsecase.getRecentSearches(req.body.userId);
            res.json({ searches });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    async premiumPayment(req: Request, res: Response): Promise<void> {
        try {
            await this.authUsecase.handlePremiumPayment(req.body.userId);
            res.json({ message: 'Premium payment recorded' });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }

    async customBackendSession(req: Request, res: Response): Promise<void> {
        try {
            const user = await this.authUsecase.findUserByEmail(req.body.email);
            res.json({ user });
        } catch (error) {
            res.status(500).json({ error: 'Server error' });
        }
    }
    async createPaymentIntent(req: Request, res: Response): Promise<void> {
        const { amount, userId, currency = 'usd' } = req.body;

        try {
            const clientSecret = await this.authUsecase.createPaymentIntent(amount, currency);
            
            // Assume premium role for the user
            await this.authUsecase.updateUserRole(userId, UserRole.Premium);
            
            res.send({ clientSecret });
        } catch (error) {
            console.error(error);
            res.status(400).send({ error: 'Error creating payment intent' });
        }
    }
}

