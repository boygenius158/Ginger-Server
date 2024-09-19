import DatingProfile from "../database/model/DatingProfileMode";

export interface IDatingRepository {
    swipeProfiles(userId: string, maximumAge: string, interestedGender: string): Promise<any>;
    updateProfileImages(userId: string, url: string[]): Promise<any>;
    fetchMatches(userId: string): Promise<any>; // Add this method
    getUserDatingProfile(userId: string): Promise<any>;
    findUserById(userId: string): Promise<any>;
    updateProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
    createProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
    saveUser(user: any): Promise<any>;
    


}

export class DatingRepository implements IDatingRepository {
    async swipeProfiles(userId: string, maximumAge: string, interestedGender: string): Promise<any> {
        const profiles = await DatingProfile.find({
            userId: { $ne: userId },  // Exclude the current user's profile
            profileVisibility: true,  // Only fetch profiles that are visible
            age: { $lte: maximumAge || Infinity },  // Apply maximum age filter if provided
            interestedGender: interestedGender || { $exists: true },  // Apply interested gender filter if provided
            likedByUsers: { $ne: userId }  // Exclude profiles that the user has already liked
        });
        return profiles;
    }

    async updateProfileImages(userId: string, url: string[]): Promise<any> {
        const profile = await DatingProfile.findOne({ userId });
        if (!profile) {
            throw new Error("Profile not found");
        }
        profile.images = url;
        await profile.save();
        return {};
    }

    async fetchMatches(userId: string): Promise<any> {
        const matches = await DatingProfile.find({
            userId: { $ne: userId },  // Exclude the current user's profile
            likedUsers: userId,  // The current user has liked these profiles
            likedByUsers: userId  // These profiles have also liked the current user
        }).populate('userId');
        return matches;
    }
    async getUserDatingProfile(userId: string): Promise<any> {
        const profile = await DatingProfile.findOne({ userId });
        return profile;
    }
    async findUserById(userId: string): Promise<any> {
        return await DatingProfile.findOne({ userId });
    }

    async updateProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any> {
        return DatingProfile.updateOne(
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
    }

    async createProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any> {
        const profile = new DatingProfile({
            userId,
            name: formData.name,
            age: formData.age,
            bio: formData.bio,
            gender: formData.gender
        });
        return profile.save();
    }
    async saveUser(user: any): Promise<any> {
        return await user.save();
    }
}