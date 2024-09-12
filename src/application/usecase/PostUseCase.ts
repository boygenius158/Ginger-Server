import mongoose, { ObjectId } from "mongoose";
import { Post } from "../../domain/entities/Post";
import { User } from "../../domain/entities/User";
import { Comment } from "../../domain/entities/Comment";

import { IMediaRepository } from "../interface/IMediaRepository";
import { IMediaUseCase } from "../interface/IMediaUseCase";

export class MediaUseCase implements IMediaUseCase {
    private repository: IMediaRepository;

    constructor(repository: IMediaRepository) {
        this.repository = repository;
    }
    async findUserId(email: string): Promise<string | null> {
        const userId = await this.repository.findUserId(email)
        return userId
    }
    async findUserIdByUsername(username: string): Promise<User> {
        const userId = await this.repository.findUserIdByUsername(username)
        if (!userId) {
            throw new Error
        }
        return userId
    }
    async createPost(imageUrl: string[], caption: string, email: string): Promise<Post | null> {
        // Implement the actual logic here
        // return this.repository.uploadPost(post);
        const userId = await this.findUserId(email)
        if (!userId) {
            throw new Error
        }
        const newPost: Post = {
            imageUrl: imageUrl,
            caption,
            userId,
            createdAt: new Date()
        }
        console.log(newPost);

        return this.repository.uploadPost(newPost)


    }
    async findUserPost(id: mongoose.Types.ObjectId): Promise<Post[] | null> {
        const posts = await this.repository.fetchPost(id)
        return posts
    }
    async followProfile(email: string, id: string): Promise<User> {
        const user = await this.repository.followProfile(email, id)
        return user
    }
    async checkFollowingStatus(email: string, id: string): Promise<boolean> {
        const user = await this.repository.checkFollowingStatus(email, id)
        if (user) {
            return true
        } else {
            return false
        }
    }
    async fetchFeed(email: string, offset: number, limit: number): Promise<Post[] | null> {
        const userId = await this.findUserId(email)
        if (!userId) {
            return null
        }
        const feed = await this.repository.fetchFeed(userId, offset, limit)
        if (!feed) {
            return null
        }

        return feed
    }
    async likePostAction(postsId: string, orginalUser: string): Promise<Post[] | null> {
        console.log("liekpostsactiop", postsId);

        const action = await this.repository.likePost(postsId, orginalUser)

        return null
    }
    async postComment(email: string, postId: string, postedComment: string): Promise<Comment> {
        const comment = await this.repository.postComment(email, postedComment, postId);
        return comment;
    }

    async uploadStory(url: string, userId: string): Promise<boolean> {
        const action = await this.repository.uploadStory(url, userId)
        return true
    }

    async updateProfile(name: string, bio: string, email: string): Promise<boolean> {
        const action = await this.repository.updateProfile(name, bio, email)
        return true
    }
    async reportPost(reporterId: string, postId: string): Promise<void> {
        await this.repository.reportPost(reporterId, postId);
    }

    async fetchSavedPosts(username: string): Promise<any> {
        // Fetch user from repository
        const user = await this.repository.findUserByUsername(username);
        if (!user) {
            throw new Error("User not found");
        }

        // Fetch saved posts
        const savedPostIds = user.savedPosts;
        const posts = await this.repository.findPostsByIds(savedPostIds);

        return { savedPosts: posts };
    }
    async updateReadStatus(sender: string, recipient: string): Promise<any> {
        // Update the read status of messages
        const result = await this.repository.updateMessageReadStatus(sender, recipient);
        return result;
    }
    async fetchHistoricalData(senderId: string, receiverId: string): Promise<any> {
        // Fetch historical messages between sender and receiver
        const messages = await this.repository.getHistoricalMessages(senderId, receiverId);
        return messages;
    }
    async getPremiumStatus(userId: string): Promise<any> {
        // Fetch the user and their roles to determine premium status
        const user = await this.repository.getUserById(userId);
        return user ? user.roles : null;
    }
    async getChatList(userId: string): Promise<any> {
        const user = await this.repository.getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        const following = user.following || [];
        const followingUsers = await this.repository.getUsersByIds(following);

        return { followingUsers };
    }
    async visitPost(postId: string): Promise<any> {
        const result = await this.repository.getPostById(postId);
        const comments = await this.repository.getCommentsByPostId(postId);

        return { result, comments };
    }
    async fetchStories(userId: string): Promise<any> {
        const followingList = await this.repository.getUserFollowing(userId);
        const stories = await this.repository.getStoriesByFollowingList(followingList);

        return stories;
    }
    async processAudioUpload(senderId: string, receiverId: string, audioUrl: string): Promise<void> {
        const audioMessageData = {
            sender: senderId,
            receiver: receiverId,
            message: audioUrl,
            type: "audio"
        };

        await this.repository.createMessage(audioMessageData);
    }
    async execute(userId: string): Promise<any[]> {
        return this.repository.getNotificationsByUserId(userId);
    }
    async executeSavePost(userId: string, postId: string): Promise<{ message: string }> {
        const objectId = new mongoose.Types.ObjectId(postId);
        const user = await this.repository.findById(userId);

        if (!user) {
            throw new Error("User not found");
        }

        if (!user.savedPosts) {
            user.savedPosts = [];
        }

        const postIndex = user.savedPosts.indexOf(objectId);

        if (postIndex === -1) {
            user.savedPosts.push(objectId);
        } else {
            user.savedPosts.splice(postIndex, 1);
        }

        await this.repository.saveUser(user);

        return { message: "Post saved/unsaved successfully" };
    }

    
} 
