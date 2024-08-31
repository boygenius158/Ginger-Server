import { User } from "../../domain/entities/User";

export interface IAuthUseCase {
    registerUser(user: User): Promise<User>;
    userExists(email: string): Promise<User | null>;
    forgotPassword(email: string): Promise<string | null>;
    changePassword(email: string ,newPassword:string): Promise<string | null>;
    getUserRole(email:string):Promise<string|null|undefined>
    storeotp(otp:string,email:string):Promise<User|null>
    verifyotp(otp:string,email:string):Promise<User|null>
    verifyPassword(email:string,password:string):Promise<User|boolean>
    clearotp(email:string):Promise<User|null>
}
