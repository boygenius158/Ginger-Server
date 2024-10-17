import mongoose from "mongoose";
import { IAuthUserRepository } from "../../application/interface/IAuthUserRepository";
import { User, UserRole } from "../../domain/entities/User";
import UserModel from "../database/model/UserModel";
import ProfileSearchHistoryModel from "../database/model/SearchHistoryModel";
import { PostModel } from "../database/model/PostModel";

const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

export class AuthRepository implements IAuthUserRepository {

    async addNewUser(user: User): Promise<User> {
        try {
            const { email, password } = user;

            const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
            const emailPrefix = email.substring(0, 5);
            const randomFiveDigitNumber = Math.floor(1000 + Math.random() * 9000);
            const username = `${emailPrefix}${randomFiveDigitNumber}`;

            const newUser = new UserModel({
                email: email,
                password: hashedPassword,
                username: username
            });

            const savedUser = await newUser.save();
            return savedUser;
        } catch (error) {
            console.error("Error adding new user:", error);
            throw new Error("Failed to add new user. Please try again later.");
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            console.log("email", email);
            const user = await UserModel.findOne({ email });
            console.log(user, "8987");

            return user ? user.toObject() as User : null; // Cast to User interface
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw new Error("Failed to find user by email. Please try again later.");
        }
    }

    async storeToken(email: string, token: string): Promise<User | null> {
        try {
            const updatedUser = await UserModel.findOneAndUpdate(
                { email: email },
                { token: token },
                { new: true }
            );
            return updatedUser ? updatedUser.toObject() as User : null; // Cast to User interface if user is found
        } catch (error) {
            console.error("Error storing token:", error);
            throw new Error("Failed to store token. Please try again later.");
        }
    }

    async updatePassword(email: string, newPassword: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            user.password = hashedPassword;
            const updatedUser = await user.save();

            return updatedUser.toObject() as User; // Cast to User interface
        } catch (error) {
            console.error("Error updating password:", error);
            throw new Error("Failed to update password. Please try again later.");
        }
    }

    async storeotp(otp: string, email: string): Promise<User> {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }
            user.otp = otp;
            await user.save();
            return user;
        } catch (error) {
            console.error("Error storing OTP:", error);
            throw new Error("Failed to store OTP. Please try again later.");
        }
    }

    async verifyotp(otp: string, email: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ email });
            console.log("current otp", email);

            if (user && user.otp === otp) {
                user.isVerified = true;
                await user.save();
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
            throw new Error("Failed to verify OTP. Please try again later.");
        }
    }

    async verifyPassword(email: string, password: string): Promise<User | boolean> {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error(`User with email ${email} not found`);
            }

            if (user.isBlocked) {
                console.log("User is blocked");
                return false;
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);
            console.log(isPasswordValid, "Password validity check");

            if (!isPasswordValid) {
                throw new Error('Invalid password');
            }
            return user;

        } catch (error) {
            console.error("Error verifying password:", error);
            throw new Error("Failed to verify password. Please try again later.");
        }
    }

    async clearotp(email: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ email });
            if (user) {
                user.otp = null;
                await user.save();
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error clearing OTP:", error);
            throw new Error("Failed to clear OTP. Please try again later.");
        }
    }

    async findById(userId: string): Promise<any> {
        try {
            // return await UserModel.findById(new mongoose.Types.ObjectId(userId));
            const userIdObject = new mongoose.Types.ObjectId(userId)
            const [userDetails, postCount] = await Promise.all([
                UserModel.findById(userIdObject),
                PostModel.countDocuments({ userId: userIdObject })
            ]);

            if (!userDetails) {
                throw new Error
            }

            // Return both in a single object
            return {
                ...userDetails.toObject(), // Spread user details into the object
                postCount
            };
        } catch (error) {
            console.error("Error finding user by ID:", error);
            throw new Error("Failed to find user by ID. Please try again later.");
        }
    }

    async updateProfilePicture(userId: string, url: string): Promise<any> {
        try {
            const updateUser = await UserModel.findById(userId)
            if (!updateUser) {
                throw new Error("User not found");
            }
             updateUser.profilePicture = url;
            console.log(updateUser);

            await updateUser.save();
            return
        } catch (error) {
            console.error("Error updating profile picture:", error);
            throw new Error("Failed to update profile picture. Please try again later.");
        }
    }

    async searchByUsername(query: string): Promise<any[]> {
        try {
            return await UserModel.find({
                username: { $regex: '^' + query, $options: 'i' }
            });
        } catch (error) {
            console.error("Error searching by username:", error);
            throw new Error("Failed to search by username. Please try again later.");
        }
    }

    async findOneByUsername(username: string): Promise<any> {
        try {
            return await UserModel.findOne({ username }).exec();
        } catch (error) {
            console.error("Error finding user by username:", error);
            throw new Error("Failed to find user by username. Please try again later.");
        }
    }

    async save(user: any): Promise<any> {
        try {
            console.log(user);
            let exist = await UserModel.findById(user._id || user.id)
            if (!exist) {
                throw new Error
            }
            exist.name = user.name,
                exist.username = user.username
            exist.bio = user.bio
            return await exist.save();

        } catch (error) {
            console.error("Error saving user:", error);
            throw new Error("Failed to save user. Please try again later.");
        }
    }
    async savePassword(user: any, password: any): Promise<any> {
        try {
            console.log(user);
            let exist = await UserModel.findById(user._id)
            if (!exist) {
                throw new Error
            }

            exist.password = password
            return await exist.save();

        } catch (error) {
            console.error("Error saving user:", error);
            throw new Error("Failed to save user. Please try again later.");
        }
    }

    async findOne(query: any): Promise<any> {
        try {
            return await UserModel.findOne(query).exec();
        } catch (error) {
            console.error("Error finding one user:", error);
            throw new Error("Failed to find user. Please try again later.");
        }
    }

    async find(query: any): Promise<any[]> {
        try {
            return await ProfileSearchHistoryModel.find(query).populate('searchedProfileId').exec();
        } catch (error) {
            console.error("Error finding search history:", error);
            throw new Error("Failed to find search history. Please try again later.");
        }
    }

    async updateUserRoles(userId: string, role: UserRole): Promise<void> {
        try {
            const user = await UserModel.findById(userId);
            if (user) {
                user.roles = role;
                await user.save();
            }
        } catch (error) {
            console.error("Error updating user roles:", error);
            throw new Error("Failed to update user roles. Please try again later.");
        }
    }
    async saveRole(userId: any, role: UserRole): Promise<void> {
        try {
            const user = await UserModel.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            user.roles = role
            await user.save()
        } catch (error) {
            console.error("Error updating user roles:", error);
            throw new Error("Failed to update user roles. Please try again later.");
        }
    }
}
