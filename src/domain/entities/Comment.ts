// entities / Comment.ts

import mongoose from "mongoose";

export interface Comment{
    userId:mongoose.Types.ObjectId
    postId:mongoose.Types.ObjectId
    content:string
    createdAt:Date
}