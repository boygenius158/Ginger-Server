import { Request, Response, NextFunction } from 'express'; // Import necessary types from Express
import { IAuthUseCase } from '../../application/interface/IAuthUseCase'; // Import the interface
import { TokenGenerator } from '../../utils/tokenGenerator';
import randomnumber from '../../utils/randomOTP';
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
}

