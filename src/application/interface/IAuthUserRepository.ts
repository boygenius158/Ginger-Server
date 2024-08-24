import { User } from "../../domain/entities/User";

export interface IAuthUserRepository {
    addNewUser(user: User): Promise<User>;
    findUserByEmail(email: string): Promise<User | null>;
    storeToken(email:string,token:string):Promise<User | null>
    updatePassword(email:string,newPassword:string):Promise<User | null >
    storeotp(otp:string,email:string):Promise<User>,
    verifyotp(otp:string,email:string):Promise<User|null>
    verifyPassword(otp:string,email:string):Promise<User | null>
    clearotp(email:string):Promise<User|null>
}
