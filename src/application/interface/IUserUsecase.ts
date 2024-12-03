import { User } from "../../domain/entities/User";

export interface IUserUsecase {
    registerUser(user: User): Promise<User>;
    userExists(email: string): Promise<User | null>;
    forgotPassword(email: string): Promise<string | null>;
    changePassword(email: string, newPassword: string): Promise<string | null>;
    getUserRole(email: string): Promise<string | null | undefined>
    storeotp(otp: string, email: string): Promise<User | null>
    verifyotp(otp: string, email: string): Promise<User | null>
    verifyPassword(email: string, password: string): Promise<User | boolean | string>
    clearotp(email: string): Promise<User | null>
    uploadProfilePicture(userId: string, url: string): Promise<any>;
    searchUsers(searchQuery: string): Promise<any[]>;
    getUserById(id: string): Promise<any>;
    hasPassword(id: string): Promise<{ hasPassword: boolean, message: string }>;
    updateUser(id: string, name: string, username: string, bio: string): Promise<any>;
    updatePassword(id: string, currentPassword: string, newPassword: string): Promise<{ success: boolean, message: string }>;
    getMiniProfile(id: string): Promise<any>;
    // saveUserToSearchHistory(userId: string, key: any): Promise<{ message: string }>;
    // getRecentSearches(userId: string): Promise<any[]>;
    handlePremiumPayment(userId: string): Promise<void>;
    findUserByEmail(email: string): Promise<any>;
    createPaymentIntent(amount: number, currency?: string): Promise<string>;
    updateUserRole(userId: string, role: any): Promise<void>;

}
