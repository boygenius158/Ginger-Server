//IMediaRepository

import mongoose from "mongoose";
import { Post } from "../../domain/entities/Post";
import { User } from "../../domain/entities/User";
import { Comment } from "../../domain/entities/Comment";

export interface IMediaRepository {
    uploadPost(post: Post): Promise<Post | null>;
    findUserId(email: string): Promise<string | null>
    findUserIdByUsername(username: string): Promise<User | null>
    fetchPost(id: mongoose.Types.ObjectId): Promise<Post[] | null>;
    followProfile(email: string, id: string): Promise<User>
    checkFollowingStatus(email: string, id: string): Promise<boolean>
    fetchFeed(id: string, offset: number, limit: number): Promise<Post[] | null>
    likePost(postId: string, orginalUser: string): Promise<boolean | null>
    postComment(email: string, postId: string, postedComment: string): Promise<Comment>
    uploadStory(url: string, userId: string): Promise<boolean>
    updateProfile(name: string, bio: string, email: string): Promise<boolean>
    reportPost(reporterId: string, postId: string): Promise<void>;
    findUserByUsername(username: string): Promise<any>; // Adjust return type as needed
    findPostsByIds(postIds: string[]): Promise<any[]>; // Adjust return type as needed
    updateMessageReadStatus(sender: string, recipient: string): Promise<any>;
    getHistoricalMessages(senderId: string, receiverId: string): Promise<any>;
    getUserById(userId: string): Promise<any>;
    getUsersByIds(userIds: string[]): Promise<any[]>;
    getPostById(postId: string): Promise<any>;
    getCommentsByPostId(postId: string): Promise<any[]>;
    getFollowers(userId: string): Promise<any[]>
    getUserFollowing(userId: string): Promise<string[]>;
    getStoriesByFollowingList(owner:string,followingList: string[]): Promise<any[]>;
    createMessage(messageData: any): Promise<any>;
    getNotificationsByUserId(userId: string): Promise<any[]>;
    findById(userId: string): Promise<any | null>;
    saveUser(user: any): Promise<void>;
    findUserById(userId: string): Promise<any>;
    findPremiumByUserId(userId: string): Promise<any>;
    getUserDemographics(): Promise<{ _id: string; count: number }[]>;
    getTopUsersByFollowers(limit: number): Promise<any[]>;



}
