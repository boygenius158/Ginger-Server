//IMediaRepository

import mongoose from "mongoose";
import { Post } from "../../domain/entities/Post";
import { User } from "../../domain/entities/User";
import { Comment } from "../../domain/entities/Comment";

export interface IMediaRepository {
    uploadPost(post: Post): Promise<Post | null>;
    findUserId(email: string): Promise<string | null>
    findUserIdByUsername(username: string): Promise<User | null>
    fetchPost(id: mongoose.Types.ObjectId): Promise<Post[]|null>;
    followProfile(email:string,id:string):Promise<User>
    checkFollowingStatus(email:string,id:string):Promise<boolean>
    fetchFeed(id:string,offset:number,limit:number):Promise<Post[]|null>
    likePost(postId:string,orginalUser:string):Promise<boolean|null>
    postComment(email:string,postId:string,postedComment:string):Promise<Comment>
    reportPost(postId:string,victimUser:string):Promise<boolean>
    uploadStory(url:string,userId:string):Promise<boolean>
    updateProfile(name:string,bio:string,email:string):Promise<boolean>
}
   