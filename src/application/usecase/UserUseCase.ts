// authUseCase.ts
import { User, UserRole } from "../../domain/entities/User";
import { IAuthUserRepository } from "../interface/IAuthUserRepository";
import { IAuthUseCase } from "../interface/IUserUsecase";
import Mailer from "../../utils/nodeMailer";
import { TokenGenerator } from "../../utils/tokenGenerator";
import ProfileSearchHistoryModel from "../../infrastructure/database/model/SearchHistoryModel";
import { PremiumModel } from "../../infrastructure/database/model/PremiumModel";
const Stripe = require('stripe');

// const stripeClient = Stripe(process.env.STRIPE_SECRET_KEY)

const bcrypt = require('bcryptjs')

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
    async verifyPassword(email: string, password: string): Promise<User | boolean | string> {
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

    async uploadProfilePicture(userId: string, url: string): Promise<any> {
        return await this._repository.updateProfilePicture(userId, url);
    }
    async searchUsers(searchQuery: string): Promise<any[]> {
        return this._repository.searchByUsername(searchQuery);
    }

    async getUserById(id: string): Promise<any> {
        return this._repository.findById(id);
    }

    async hasPassword(id: string): Promise<{ hasPassword: boolean, message: string }> {
        const user = await this._repository.findById(id);
        if (!user) throw new Error('User not found');

        if (user.password === null || user.password === undefined) {
            return { hasPassword: false, message: 'Password is not set' };
        }

        return { hasPassword: true, message: 'Password is set' };
    }

    async updateUser(id: string, name: string, username: string, bio: string): Promise<any> {
        const user = await this._repository.findById(id);
        if (!user) throw new Error('User not found');

        if (username && username !== user.username) {
            const existingUser = await this._repository.findOneByUsername(username);
            if (existingUser) {
                return { success: false };
            }
        }
        let saveuser = {
            id,
            name,
            username,
            bio
        }

        return this._repository.save(saveuser);
    }

    async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<{ success: boolean, message: string }> {
        const user = await this._repository.findById(id);
        if (!user) throw new Error('User not found');

        if (!user.password && !currentPassword) {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
            await this._repository.savePassword(user,hashedPassword);
            return { success: true, message: 'Password set successfully' };
        }

        if (user.password && currentPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                return { success: false, message: 'Current password is incorrect' };
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);
            user.password = hashedPassword;
            await this._repository.savePassword(user,hashedPassword);
            return { success: true, message: 'Password updated successfully' };
        }

        throw new Error('Invalid request: Missing current or new password');
    }
    async getMiniProfile(id: string): Promise<any> {
        return this._repository.findById(id);
    }

    async saveUserToSearchHistory(userId: string, key: any): Promise<{ message: string }> {
        const existingEntry = await this._repository.findOne({
            userId: userId,
            searchedProfileId: key._id
        });

        if (existingEntry) {
            return { message: "Entry already exists" };
        }

        const searchHistory = new ProfileSearchHistoryModel({
            userId: userId,
            searchedProfileId: key._id
        });

        await this._repository.save(searchHistory);
        return { message: "Search history saved" };
    }

    async getRecentSearches(userId: string): Promise<any[]> {
        // Perform the query and populate the results
        return this._repository.find({ userId });

    }

    async handlePremiumPayment(userId: string): Promise<void> {
        
        // await this._repository.save(premium);
        await this.updateUserRole(userId,UserRole.Premium)
    }

    async findUserByEmail(email: string): Promise<any> {
        console.log("987777");

        return this._repository.findOne({ email });
    }

    async createPaymentIntent(amount: number, currency: string = 'usd'): Promise<string> {
        const paymentIntent = await stripeClient.paymentIntents.create({
            amount,
            currency,
        });
        return paymentIntent.client_secret;
    }

    async updateUserRole(userId: string, role: UserRole): Promise<void> {
        const user = await this._repository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        user.roles = role; // role should be of type UserRole
        await this._repository.saveRole(user._id,UserRole.Premium);
    }
    
}
 