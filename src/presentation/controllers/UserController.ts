import { Request, Response, NextFunction } from 'express'; // Import necessary types from Express
import { IUserUsecase } from '../../application/interface/IUserUsecase'; // Import the interface
import { TokenGenerator } from '../../utils/tokenGenerator';
import randomnumber from '../../utils/randomOTP';
import { UserRole } from '../../domain/entities/User';
import { HttpStatus } from '../../utils/HttpStatus';
import { UserUseCase } from '../../application/usecase/UserUseCase';
// import { UserModel } from '../../infrastructure/database/model/authModel';
export class UserController {
    private _userUseCase: IUserUsecase;
    private _tokenGenerator: TokenGenerator;

    constructor(UserUseCase: IUserUsecase) {
        this._userUseCase = UserUseCase;
        this._tokenGenerator = new TokenGenerator();
    }

    async signUpUser(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const userExists = await this._userUseCase.userExists(email);
            // this._userUseCase
            if (!userExists) {
                const userData = await this._userUseCase.registerUser(req.body);
                console.log(userData, "990099");

                return res.json(userData);
            }
            return res.json({ success: false, message: "User already exists" });
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }

    async loginUser(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this._userUseCase.userExists(req.body.email);
            if (!user) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ error: "User not found" });
            }
            // console.log(user,"{{{");

            const user2 = await this._userUseCase.verifyPassword(req.body.email, req.body.password);
            // console.log("user",user2);
            console.log(user2, "popo");

            return res.json(user2);
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }

    async googleAuth(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this._userUseCase.userExists(req.body.email);
            if (user) {
                return res.json(user);
            } else {
                console.log("0099");

                const newUser = await this._userUseCase.registerUser(req.body);
                return res.json(newUser);
            }
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }

    async forgetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const user = await this._userUseCase.userExists(req.body.email);
            if (user) {
                await this._userUseCase.forgotPassword(user.email);
                return res.json({ success: true, message: "Email has been sent" });
            } else {
                return res.json({ success: false, message: "User doesn't exist" });
            }
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }

    async changePassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { token, password } = req.body;
            const secretKey = "nibla158";
            console.log(req.body);

            const decodedToken = this._tokenGenerator.verifyToken(token, secretKey);
            if (!decodedToken) {
                return res.status(HttpStatus.UNAUTHORIZED).json({ error: "Invalid or expired token" });
            }

            await this._userUseCase.changePassword(decodedToken.email, password);
            return res.json({ success: true, message: "Password changed successfully" });
        } catch (error) {
            console.error("Error in changePassword:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }

    async checkRole(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("check role", req.body);

            const user = await this._userUseCase.userExists(req.body.email);
            // console.log(user);

            if (!user) {
                return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "User not found" });
            }
            const userRole = await this._userUseCase.getUserRole(req.body.email);
            console.log("Ds", userRole, "sd");

            if (userRole) {
                return res.json({ success: true, role: userRole });
            } else {
                return res.status(HttpStatus.FORBIDDEN).json({ success: false, message: "User does not have a role" });
            }
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }

    async generateotp(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const user = await this._userUseCase.userExists(req.body.email);
            if (!user) {
                return res.json({ success: false });

                // return res.status(HttpStatus.NOT_FOUND).json({ success: false, message: "User not found" });
            }
            const otp = await randomnumber();
            await this._userUseCase.storeotp(otp, email);
            return res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }

    async verifyotp(req: Request, res: Response, next: NextFunction) {
        try {
            const userAlreadyVerified = await this._userUseCase.userExists(req.body.email)
            if (!userAlreadyVerified) {
                return res.json({ success: false })
            }
            if (userAlreadyVerified.isVerified === true) {
                return res.json({ success: false })
            }
            const valid = await this._userUseCase.verifyotp(req.body.otp, req.body.email);

            if (valid) {
                return res.json({ success: true });

            } else {
                return res.json({ success: false });

            }
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }

    async clearotp(req: Request, res: Response, next: NextFunction) {
        try {
            await this._userUseCase.clearotp(req.body.email);
            return res.json({ success: true });
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }

    async uploadProfile(req: Request, res: Response): Promise<void> {
        try {
            const { url, userId } = req.body;
            const updatedUser = await this._userUseCase.uploadProfilePicture(userId, url);
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            console.error("Error uploading profile picture:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        }
    }
    async searchUser(req: Request, res: Response): Promise<void> {
        try {
            const searchQuery = req.query.searchQuery as string;
            if (!searchQuery) {
                res.status(HttpStatus.BAD_REQUEST).json({ error: "Search query is required" });
            }
            const users = await this._userUseCase.searchUsers(searchQuery);
            res.json({ users });
        } catch (error) {
            console.error("Error searching users:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        }
    }
    async fetchNameUsername(req: Request, res: Response): Promise<void> {
        try {
            const user = await this._userUseCase.getUserById(req.body.id);
            if (!user) {
                res.status(HttpStatus.NOT_FOUND).json({ error: 'User not found' });
            } else {
                res.json({ user });
            }
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }
    }

    async hasPassword(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const result = await this._userUseCase.hasPassword(id);
            res.json(result);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }
    }

    async updateUser(req: Request, res: Response): Promise<void> {
        try {
            const { id, name, username, bio } = req.body;
            // console.log(req.body);

            const result = await this._userUseCase.updateUser(id, name, username, bio);
            if (result.success === false) {
                res.json(result);
            } else {
                res.json({ success: true, user: result });
            }
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }
    }

    async updatePassword(req: Request, res: Response): Promise<void> {
        try {
            const { id, currentPassword, newPassword } = req.body;
            const result = await this._userUseCase.updatePassword(id, currentPassword, newPassword);
            res.json(result);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }
    }
    async miniProfile(req: Request, res: Response): Promise<void> {
        try {
            const user = await this._userUseCase.getMiniProfile(req.body.id);
            res.json({ user });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }
    }

    async saveUserToSearchHistory(req: Request, res: Response): Promise<void> {
        try {
            const result = await this._userUseCase.saveUserToSearchHistory(req.body.userId, req.body.key);
            res.json(result);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }
    }

    async getRecentSearches(req: Request, res: Response): Promise<void> {
        try {
            const searches = await this._userUseCase.getRecentSearches(req.body.userId);
            res.json({ searches });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }
    }

    async premiumPayment(req: Request, res: Response): Promise<void> {
        try {
            await this._userUseCase.handlePremiumPayment(req.body.userId);
            res.json({ message: 'Premium payment recorded' });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }
    }

    async customBackendSession(req: Request, res: Response): Promise<void> {
        try {
            console.log("req.body.emali", req.body.email);

            const user = await this._userUseCase.findUserByEmail(req.body.email);
            console.log("userrT", user);

            res.json({ user });
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }
    }
    async createPaymentIntent(req: Request, res: Response): Promise<void> {
        const { amount, userId, currency = 'usd' } = req.body;

        try {
            const clientSecret = await this._userUseCase.createPaymentIntent(amount, currency);

            // Assume premium role for the user
            await this._userUseCase.updateUserRole(userId, UserRole.Premium);

            res.send({ clientSecret });
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.BAD_REQUEST).send({ error: 'Error creating payment intent' });
        }
    }

}

