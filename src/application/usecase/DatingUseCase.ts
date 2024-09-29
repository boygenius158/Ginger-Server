// import { IDatingRepository } from "../../infrastructure/repository/DatingRepository";

import { IDatingRepository } from "../interface/IDatingRepository";

export interface IDatingUseCase {
    swipeProfiles(userId: string, maximumAge: number, interestedGender: string): Promise<any>;
    updateProfileImages(userId: string, url: string[]): Promise<any>;
    fetchMatches(userId: string): Promise<any>;
    getUserDatingProfile(userId: string): Promise<any>;
    handleDatingTab1(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
    getProfileImages(userId: string): Promise<string[] | null>;
    updateUserPreferences(userId: string, maximumAge: number, profileVisibility: boolean, interestedGender: string): Promise<any>;
    getUserSettings(userId: string): Promise<any>;
    getDatingTab1Details(userId: string): Promise<any>;
}

export class DatingUseCase implements IDatingUseCase {
    private _repository: IDatingRepository;

    constructor(_repository: IDatingRepository) {
        this._repository = _repository;
    }

    async swipeProfiles(userId: string, maximumAge: number, interestedGender: string): Promise<any> {
        try {
            const datingProfile = await this._repository.getUserDatingProfile(userId);
            console.log(datingProfile.name);
            const profiles = await this._repository.swipeProfiles(userId, datingProfile.maximumAge, datingProfile.interestedGender);
            return profiles;
        } catch (error) {
            console.error("Error while swiping profiles:", error);
            throw new Error("Failed to swipe profiles");
        }
    }

    async updateProfileImages(userId: string, url: string[]): Promise<any> {
        try {
            await this._repository.updateProfileImages(userId, url);
            return {};
        } catch (error) {
            console.error("Error updating profile images:", error);
            throw new Error("Failed to update profile images");
        }
    }

    async fetchMatches(userId: string): Promise<any> {
        try {
            const matches = await this._repository.fetchMatches(userId);
            return matches;
        } catch (error) {
            console.error("Error fetching matches:", error);
            throw new Error("Failed to fetch matches");
        }
    }

    async getUserDatingProfile(userId: string): Promise<any> {
        try {
            const profile = await this._repository.getUserDatingProfile(userId);
            return profile;
        } catch (error) {
            console.error("Error fetching user dating profile:", error);
            throw new Error("Failed to get user dating profile");
        }
    }

    async handleDatingTab1(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any> {
        try {
            const user = await this._repository.findUserById(userId);
            if (user) {
                return await this._repository.updateProfile(userId, formData);
            } else {
                return await this._repository.createProfile(userId, formData);
            }
        } catch (error) {
            console.error("Error handling dating tab 1:", error);
            throw new Error("Failed to handle dating tab 1");
        }
    }

    async getProfileImages(userId: string): Promise<string[] | null> {
        try {
            const user = await this._repository.findUserById(userId);
            return user ? user.images : null;
        } catch (error) {
            console.error("Error fetching profile images:", error);
            throw new Error("Failed to get profile images");
        }
    }

    async updateUserPreferences(userId: string, maximumAge: number, profileVisibility: boolean, interestedGender: string): Promise<any> {
        try {
            console.log("Interested Gender:", interestedGender);
            const user = await this._repository.findUserById(userId);
            if (!user) {
                throw new Error("User not found");
            }

            user.maximumAge = maximumAge;
            user.profileVisibility = profileVisibility;
            user.interestedGender = interestedGender;
            await this._repository.saveUser(user);

            return user;
        } catch (error) {
            console.error("Error updating user preferences:", error);
            throw new Error("Failed to update user preferences");
        }
    }

    async getUserSettings(userId: string): Promise<any> {
        try {
            const user = await this._repository.findUserById(userId);
            console.log(user);
            if (!user) {
                return null;
            }

            // Define default values if necessary
            return {
                maximumAge: user.maximumAge || 18,
                profileVisibility: user.profileVisibility || false,
                gender: user.interestedGender || 'not specified'
            };
        } catch (error) {
            console.error("Error fetching user settings:", error);
            throw new Error("Failed to get user settings");
        }
    }

    async getDatingTab1Details(userId: string): Promise<any> {
        try {
            const user = await this._repository.findUserById(userId);
            if (!user) {
                return null;
            }

            // Extract form data from the user profile
            return {
                name: user.name,
                age: user.age,
                bio: user.bio,
                gender: user.gender
            };
        } catch (error) {
            console.error("Error fetching dating tab 1 details:", error);
            throw new Error("Failed to get dating tab 1 details");
        }
    }
}
