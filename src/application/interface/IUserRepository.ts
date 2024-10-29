import { User } from "../../domain/entities/User";

export interface IUserRepository {
    addNewUser(user: User): Promise<User>;
    findUserByEmail(email: string): Promise<User | null>;
    storeToken(email: string, token: string): Promise<User | null>
    updatePassword(email: string, newPassword: string): Promise<User | null>
    storeotp(otp: string, email: string): Promise<User>,
    verifyotp(otp: string, email: string): Promise<User | null>
    verifyPassword(otp: string, email: string): Promise<User | boolean | string>
    clearotp(email: string): Promise<User | null>
    findById(userId: string): Promise<any>;
    updateProfilePicture(userId: string, url: string): Promise<any>;
    searchByUsername(query: string): Promise<any[]>;
    findById(id: string): Promise<any>;
    findOneByUsername(username: string): Promise<any>;
    save(user: any): Promise<any>;
    findOne(query: any): Promise<any>;
    save(entry: any): Promise<any>;
    find(query: any): Promise<any[]>;
    save(premium: any): Promise<any>;
    findById(id: string): Promise<any>;
    findOne(query: any): Promise<any>;
    updateUserRoles(userId: string, role: string): Promise<void>;
    savePassword(user: any, password: any): Promise<any>
    saveRole(userId: any, role: string): Promise<void>


}
