import mongoose, { ObjectId } from "mongoose";
import { Post } from "../../domain/entities/Post";
import { User } from "../../domain/entities/User";
import { Comment } from "../../domain/entities/Comment";
import { ChartConfig, ChartData } from "./ChartInterfaces";

export interface IPostUseCase {
    findUserId(email: string): Promise<string | null>
    findUserIdByUsername(username: string): Promise<User>
    createPost(imageUrl: string[], caption: string, email: string): Promise<Post | null>;
    findUserPost(id: mongoose.Types.ObjectId): Promise<Post[] | null>
    followProfile(email: string, id: string): Promise<User>
    fetchFeed(email: string,offset:number,limit:number): Promise<Post[] | null>
    likePostAction(postsId: string, orginalUser: string): Promise<Post[] | null>
    postComment(email:string,postId:string,postedComment:string):Promise<Comment>
    reportPost(reporterId: string, postId: string): Promise<void>;
    fetchSavedPosts(username: string): Promise<any>; // Adjust return type as needed
    fetchHistoricalData(senderId: string, receiverId: string): Promise<any>;
    getChatList(userId: string): Promise<any>;
    visitPost(postId: string): Promise<any>;
    processAudioUpload(senderId: string, receiverId: string, audioUrl: string): Promise<void>;
    execute(userId: string): Promise<any[]>;
    executeSavePost(userId: string, postId: string): Promise<{ message: string }>;
    getUserDemographics(): Promise<{ label: string; value: number }[]>;
    getChartData(): Promise<{ chartData: ChartData[], chartConfig: ChartConfig }>;


}
