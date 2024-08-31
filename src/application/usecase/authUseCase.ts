// authUseCase.ts
import { User } from "../../domain/entities/User";
import { IAuthUserRepository } from "../interface/IAuthUserRepository";
import { IAuthUseCase } from "../interface/IAuthUseCase";
import Mailer from "../../utils/nodeMailer";
import { TokenGenerator } from "../../utils/tokenGenerator";

export class AuthUseCase implements IAuthUseCase {
    private _repository: IAuthUserRepository;
    private mailer: Mailer;
    private tokenGenerator: TokenGenerator;

    constructor(_repository: IAuthUserRepository) {
        this._repository = _repository;
        this.mailer = new Mailer();
        this.tokenGenerator = new TokenGenerator();
    }

    async userExists(email: string): Promise<User | null> {

        const user = await this._repository.findUserByEmail(email);

        return user ? user : null;
    }
    async verifyPassword(email: string, password: string): Promise<User | boolean> {
        const verify = await this._repository.verifyPassword(email, password)
        return verify
    }

    async registerUser(user: User): Promise<User> {
        try {
            const existingUser = await this.userExists(user.email);
            if (existingUser) {
                throw new Error("User already exists");
            }
            const registeredUser = await this._repository.addNewUser(user);
            return registeredUser;
        } catch (error) {
            console.error("Error registering user:", error);
            throw error;
        }
    }

    async forgotPassword(email: string): Promise<string | null> {
        try {


            const payload = {
                email,
                action: 'reset_password',
            };
            const secretKey = 'nibla158';
            const expiresIn = '1h';
            const token = this.tokenGenerator.generateToken(payload, secretKey, expiresIn);

            await this.mailer.sendVerificationMail(email, token);
            await this._repository.storeToken(email, token)
            console.log("Generated token:", token);
            return token;
        } catch (error) {
            console.error("Error processing forgot password:", error);
            throw error;
        }
    }
    async changePassword(email: string, newPassword: string): Promise<string | null> {
        try {
            await this._repository.updatePassword(email, newPassword)
            return null
        } catch (error) {
            console.error("Error processing forgot password:", error);
            throw error;
        }
    }
    async getUserRole(email: string): Promise<string | null | undefined> {
        const user = await this._repository.findUserByEmail(email); // Fetch user from the _repository
        if (user) {
            return user.roles;
        }
        return null;
    }
    async storeotp(otp: string, email: string): Promise<User | null> {
        try {
            const user = await this.userExists(email);
            if (user) {
                const store = await this._repository.storeotp(otp, user.email);
                console.log(store.otp, "this is store");
    
                if (store.otp) {
                    const number = store.otp;
                    await this.mailer.sendOtpMail(email, number);
                } else {
                    throw new Error("OTP is undefined");
                }
    
                return store;
            } else {
                // Explicitly handle the case where the user does not exist
                return null;
            }
        } catch (error) {
            console.error("Error storing OTP:", error);
            throw error; // Re-throw the error to be handled by the caller
        }
    }
    
    async verifyotp(otp: string, email: string): Promise<User | null> {
        try {
            const verify = await this._repository.verifyotp(otp, email)
            return verify
        } catch (error) {
            console.error("Error storing OTP:", error);
            throw error; // Re-throw the error to be handled by the caller
        }
    }
    async clearotp(email: string): Promise<User | null> {
        try {
            const user = await this._repository.clearotp(email)
            return user
        } catch (error) {
            console.error("Error storing OTP:", error);
            throw error; // Re-throw the error to be handled by the caller
        }
    }



}
