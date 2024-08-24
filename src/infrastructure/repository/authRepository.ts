import { IAuthUserRepository } from "../../application/interface/IAuthUserRepository";
import { User } from "../../domain/entities/User";
import UserModel from "../database/model/authModel";

const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing

export class AuthRepository implements IAuthUserRepository {
    // private readonly userModel: Model<UserModel>;

    // constructor(userModel: Model<UserModel>) {
    //     this.userModel = userModel;
    // }
    async addNewUser(user: User): Promise<User> {
        try {
            const { email, password } = user;

            const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
            const emailPrefix = email.substring(0,5)
            const randomFiveDigitNumber = Math.floor(1000 + Math.random() * 9000)
            const username = `${emailPrefix}${randomFiveDigitNumber}`;

            const newUser = new UserModel({
                email: email,
                password: hashedPassword,
                username:username
            });

            const savedUser = await newUser.save();
            return savedUser
        } catch (error) {
            console.error("Error adding new user:", error);
            throw error;
        }
    }


    async findUserByEmail(email: string): Promise<User | null> {
        try {
            // const user = await UserModel.findOne({ email }).select("_id email password roles");
            const user = await UserModel.findOne({ email })
            return user ? user.toObject() as User : null; // Cast to User interface
        } catch (error) {
            console.error("Error finding user by email:", error);
            throw error;
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
            throw error;
        }
    }

    async updatePassword(email: string, newPassword: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            // Hash the new password using the same method as in addNewUser
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            // Update the user's password with the hashed password
            user.password = hashedPassword;

            // Save the updated user
            const updatedUser = await user.save();

            return updatedUser.toObject() as User; // Cast to User interface
        } catch (error) {
            console.error("Error updating password:", error);
            throw error;
        }
    }
    async storeotp(otp: string, email: string): Promise<User> {
        try {
            const user = await UserModel.findOne({ email })
            if (!user) {
                throw new Error('User not found');

            }
            user.otp = otp
            await user.save()
            return user

        } catch (error) {
            console.error("Error updating password:", error);
            throw error;
        }
    }
    async verifyotp(otp: string, email: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ email })
            if (user && user.otp === otp) {
                user.isVerified = true
                await user.save()
                return user;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error updating password:", error);
            throw error;
        }
    }
    async verifyPassword(email: string, password: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ email })

            if (!user) {
                throw new Error(`User with email ${email} not found`);
            }
            const isPasswordValid = await bcrypt.compare(password, user.password)
            console.log(isPasswordValid, "adf");

            if (!isPasswordValid) {
                throw new Error('invalid password')
            }
            return user

        } catch (error) {
            console.error("Error updating password:", error);
            throw error;
        }
    }

    async clearotp(email: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ email })
            if (user) {
                user.otp = null
                await user.save()
                return user
            } else {
                return null
            }

        } catch (error) {
            console.error("Error updating password:", error);
            throw error;
        }
    }
}
