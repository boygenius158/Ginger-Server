import mongoose, { ObjectId } from "mongoose";
import { Post } from "../../domain/entities/Post";
import { User } from "../../domain/entities/User";
import { Comment } from "../../domain/entities/Comment";

export interface IMediaUseCase {
    findUserId(email: string): Promise<string | null>
    findUserIdByUsername(username: string): Promise<User>
    createPost(imageUrl: string[], caption: string, email: string): Promise<Post | null>;
    findUserPost(id: mongoose.Types.ObjectId): Promise<Post[] | null>
    followProfile(email: string, id: string): Promise<User>
    checkFollowingStatus(email: string, id: string): Promise<boolean>
    fetchFeed(email: string,offset:number,limit:number): Promise<Post[] | null>
    likePostAction(postsId: string, orginalUser: string): Promise<Post[] | null>
    postComment(email:string,postId:string,postedComment:string):Promise<Comment>
    reportPost(postId:string,victimUser:string):Promise<boolean>
    uploadStory(url:string,userId:string):Promise<boolean>
    updateProfile(name:string,bio:string,email:string):Promise<boolean>
}
