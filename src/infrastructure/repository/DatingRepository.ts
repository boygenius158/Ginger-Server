import { IDatingRepository } from "../../application/interface/IDatingRepository";
import DatingProfile from "../database/model/DatingProfileMode";

// export interface IDatingRepository {
//     swipeProfiles(userId: string, maximumAge: number, interestedGender: string): Promise<any>;
//     updateProfileImages(userId: string, url: string[]): Promise<any>;
//     fetchMatches(userId: string): Promise<any>;
//     getUserDatingProfile(userId: string): Promise<any>;
//     findUserById(userId: string): Promise<any>;
//     updateProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
//     createProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
//     saveUser(user: any): Promise<any>;
// }

export class DatingRepository implements IDatingRepository {
    async swipeProfiles(userId: string, maximumAge: number, interestedGender: string): Promise<any> {
        console.log(userId, maximumAge, interestedGender, "maximumage");
        try {
            const profiles = await DatingProfile.find({
                userId: { $ne: userId },
                profileVisibility: true,
                age: { $lte: maximumAge },
                gender: interestedGender,
                likedByUsers: { $ne: userId }
            });
            console.log(profiles, "profiles");
            return profiles;
        } catch (error) {
            console.error("Error fetching swipe profiles:", error);
            throw new Error("Failed to fetch swipe profiles. Please try again later.");
        }
    }

    async updateProfileImages(userId: string, url: string[]): Promise<any> {
        try {
            const profile = await DatingProfile.findOne({ userId });
            if (!profile) {
                throw new Error("Profile not found");
            }
            profile.images = url;
            await profile.save();
            return {};
        } catch (error) {
            console.error("Error updating profile images:", error);
            throw new Error("Failed to update profile images. Please try again later.");
        }
    }

    async fetchMatches(userId: string): Promise<any> {
        try {
            const matches = await DatingProfile.find({
                userId: { $ne: userId },  // Exclude the current user's profile
                likedUsers: userId,  // The current user has liked these profiles
                likedByUsers: userId  // These profiles have also liked the current user
            }).populate('userId');
            return matches;
        } catch (error) {
            console.error("Error fetching matches:", error);
            throw new Error("Failed to fetch matches. Please try again later.");
        }
    }

    async getUserDatingProfile(userId: string): Promise<any> {
        try {
            const profile = await DatingProfile.findOne({ userId });
            if (!profile) {
                throw new Error("Profile not found");
            }
            return profile;
        } catch (error) {
            console.error("Error fetching user dating profile:", error);
            throw new Error("Failed to fetch user dating profile. Please try again later.");
        }
    }

    async findUserById(userId: string): Promise<any> {
        try {
            const profile = await DatingProfile.findOne({ userId });
            if (!profile) {
                throw new Error("User not found");
            }
            return profile;
        } catch (error) {
            console.error("Error finding user by ID:", error);
            throw new Error("Failed to find user by ID. Please try again later.");
        }
    }

    async updateProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any> {
        try {
            const result = await DatingProfile.updateOne(
                { userId },
                {
                    $set: {
                        name: formData.name,
                        age: formData.age,
                        bio: formData.bio,
                        gender: formData.gender
                    }
                }
            );
            // if (result.nModified === 0) {
            //     throw new Error("No profile updated");
            // }
            return result;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw new Error("Failed to update profile. Please try again later.");
        }
    }

    async createProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any> {
        try {
            const profile = new DatingProfile({
                userId,
                name: formData.name,
                age: formData.age,
                bio: formData.bio,
                gender: formData.gender
            });
            return await profile.save();
        } catch (error) {
            console.error("Error creating profile:", error);
            throw new Error("Failed to create profile. Please try again later.");
        }
    }

    async saveUser(user: any): Promise<any> {
        console.log(user, "iii");
        try {
            return await user.save();
        } catch (error) {
            console.error("Error saving user:", error);
            throw new Error("Failed to save user. Please try again later.");
        }
    }
}
