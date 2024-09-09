import { IDatingRepository } from "../../infrastructure/repository/DatingRepository";

export interface IDatingUseCase {
    swipeProfiles(userId: string, maximumAge: string, interestedGender: string): Promise<any>;
    updateProfileImages(userId: string, url: string[]): Promise<any>;
    fetchMatches(userId: string): Promise<any>; // Add this method
    getUserDatingProfile(userId: string): Promise<any>;
    handleDatingTab1(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
    getProfileImages(userId: string): Promise<string[] | null>;
    updateUserPreferences(userId: string, maximumAge: number, profileVisibility: boolean): Promise<any>;
    getUserSettings(userId: string): Promise<any>;
    getDatingTab1Details(userId: string): Promise<any>;



}


export class DatingUseCase implements IDatingUseCase {
    private _repository: IDatingRepository;

    constructor(_repository: IDatingRepository) {
        this._repository = _repository;
    }

    async swipeProfiles(userId: string, maximumAge: string, interestedGender: string): Promise<any> {
        const profiles = await this._repository.swipeProfiles(userId, maximumAge, interestedGender);
        return profiles;
    }

    async updateProfileImages(userId: string, url: string[]): Promise<any> {
        await this._repository.updateProfileImages(userId, url);
        return {};
    }

    async fetchMatches(userId: string): Promise<any> {
        const matches = await this._repository.fetchMatches(userId);
        return matches;
    }

    async getUserDatingProfile(userId: string): Promise<any> {
        const profile = await this._repository.getUserDatingProfile(userId);
        return profile;
    }
    async handleDatingTab1(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any> {
        const user = await this._repository.findUserById(userId);

        if (user) {
            return await this._repository.updateProfile(userId, formData);
        } else {
            return await this._repository.createProfile(userId, formData);
        }
    }
    async getProfileImages(userId: string): Promise<string[] | null> {
        const user = await this._repository.findUserById(userId);
        return user ? user.images : null;
    }
    async updateUserPreferences(userId: string, maximumAge: number, profileVisibility: boolean): Promise<any> {
        const user = await this._repository.findUserById(userId);
        if (!user) {
            return null;
        }
        
        user.maximumAge = maximumAge;
        user.profileVisibility = profileVisibility;
        
        await this._repository.saveUser(user);

        return user;
    }
    async getUserSettings(userId: string): Promise<any> {
        const user = await this._repository.findUserById(userId);
        if (!user) {
            return null;
        }

        // Define default values if necessary
        return {
            maximumAge: user.maximumAge || 18,
            profileVisibility: user.profileVisibility || false,
            gender: user.gender || 'not specified'
        };
    }
    async getDatingTab1Details(userId: string): Promise<any> {
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
    }
    

   
}
