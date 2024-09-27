import mongoose, { ObjectId } from "mongoose";
import { Post } from "../../domain/entities/Post";
import { User } from "../../domain/entities/User";
import { Comment } from "../../domain/entities/Comment";

import { IMediaRepository } from "../interface/IMediaRepository";
import { IMediaUseCase } from "../interface/IMediaUseCase";
import { ChartConfig, ChartData } from "../interface/ChartInterfaces";

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
    async getExpiryDate(userId: string): Promise<number> {
        const user = await this.repository.findUserById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        if (user.roles !== 'premium' && user.roles !== 'admin') {
            throw new Error('User does not have the required role');
        }

        const premium = await this.repository.findPremiumByUserId(userId);

        if (!premium?.createdAt) {
            throw new Error('Premium document or createdAt not found');
        }

        const createdAt = new Date(premium.createdAt);
        const expiryDate = new Date(createdAt);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);

        const today = new Date();
        const timeDiff = expiryDate.getTime() - today.getTime();
        const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

        return daysLeft;
    }
    async getUserDemographics(): Promise<{ label: string; value: number }[]> {
        console.log("pop");

        const demographics = await this.repository.getUserDemographics();

        return demographics.map((demographic: any) => ({
            label: demographic._id,
            value: demographic.count
        }));
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
        // Get the user by ID
        const user = await this.repository.getUserById(userId);
        if (!user) {
            throw new Error("User not found");
        }

        // Get the following and followers lists
        const following = user.following || [];
        const followers = user.followers || [];

        // Combine both arrays and remove duplicates (in case any user is in both lists)
        const combinedUsers = Array.from(new Set([...following, ...followers]));

        // Fetch the user details of these combined users
        const uniqueUsers = await this.repository.getUsersByIds(combinedUsers);

        return { uniqueUsers };
    }


    async visitPost(postId: string): Promise<any> {
        const result = await this.repository.getPostById(postId);
        const comments = await this.repository.getCommentsByPostId(postId);

        return { result, comments };
    }
    async fetchStories(userId: string): Promise<any> {
        const followingList = await this.repository.getUserFollowing(userId);
        const stories = await this.repository.getStoriesByFollowingList(userId, followingList);

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

    async getChartData(): Promise<{ chartData: ChartData[], chartConfig: ChartConfig }> {
        interface UserType {
            username: string;
            followerCount: number;
        }

        const data = await this.repository.getTopUsersByFollowers(3);

        // Map the aggregation result to the required chartData format
        const chartData: ChartData[] = data.map((user: UserType) => ({
            username: user.username,
            followers: user.followerCount,
            fill: "var(--color-other)" // Replace this with actual color logic if needed
        }));

        // Generate chartConfig dynamically based on chartData
        const chartConfig: ChartConfig = chartData.reduce((config, user, index) => {
            const colorVar = `--chart-${index + 2}`;
            config[user.username] = {
                label: user.username,
                color: `hsl(var(${colorVar}))`
            };
            return config;
        }, {} as ChartConfig);

        // Add any additional static or predefined configurations
        chartConfig.visitors = {
            label: "Visitors",
            color: 'hsl(var(--chart-visitors))' // Add a default color if needed
        };

        return { chartData, chartConfig };
    }
} 
