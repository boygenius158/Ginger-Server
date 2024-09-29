export interface IDatingRepository {
    swipeProfiles(userId: string, maximumAge: number, interestedGender: string): Promise<any>;
    updateProfileImages(userId: string, url: string[]): Promise<any>;
    fetchMatches(userId: string): Promise<any>;
    getUserDatingProfile(userId: string): Promise<any>;
    findUserById(userId: string): Promise<any>;
    updateProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
    createProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
    saveUser(user: any): Promise<any>;
}