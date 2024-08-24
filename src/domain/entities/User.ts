import mongoose from "mongoose";

export enum UserRole {
    Admin = 'admin',
    Premium = 'premium',
    User = 'user'
}

export interface User {
    _id: mongoose.Types.ObjectId;
    email: string;
    password: string;
    username?:string;
    roles?: UserRole;
    otp?:string | null
    savedposts?:string[]
    

}
