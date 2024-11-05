import mongoose, { ObjectId } from "mongoose";
import { Post } from "../../domain/entities/Post";
import { User } from "../../domain/entities/User";
import { Comment } from "../../domain/entities/Comment";

import { IPostRepository } from "../interface/IPostRepository";
import { IPostUseCase } from "../interface/IPostUseCase";
import { ChartConfig, ChartData } from "../interface/ChartInterfaces";

export class PostUseCase implements IPostUseCase {
    private _repository: IPostRepository;

    constructor(repository: IPostRepository) {
        this._repository = repository;
    }
    async findUserId(email: string): Promise<string | null> {
        try {
            const userId = await this._repository.findUserId(email);
            return userId;
        } catch (error) {
            console.error("Error in findUserId:", error);
            throw new Error("findUserId resulting in error");
        }
    }

    async findUserIdByUsername(username: string): Promise<User> {
        try {
            const userId = await this._repository.findUserIdByUsername(username);
            if (!userId) {
                throw new Error("User not found");
            }
            return userId;
        } catch (error) {
            console.error("Error in findUserIdByUsername:", error);
            throw new Error("Unable to find user by username");
        }
    }

    async getExpiryDate(userId: string): Promise<number> {
        try {
            const user = await this._repository.findUserById(userId);

            if (!user) {
                throw new Error("User not found");
            }

            if (user.roles !== 'premium' && user.roles !== 'admin') {
                throw new Error("User does not have the required role");
            }

            const premium = await this._repository.findPremiumByUserId(userId);

            if (!premium?.createdAt) {
                throw new Error("Premium document or createdAt not found");
            }

            const createdAt = new Date(premium.createdAt);
            const expiryDate = new Date(createdAt);
            expiryDate.setFullYear(expiryDate.getFullYear() + 1);

            const today = new Date();
            const timeDiff = expiryDate.getTime() - today.getTime();
            const daysLeft = Math.ceil(timeDiff / (1000 * 3600 * 24));

            return daysLeft;
        } catch (error) {
            console.error("Error in getExpiryDate:", error);
            throw new Error("Unable to calculate expiry date");
        }
    }

    async getUserDemographics(): Promise<{ label: string; value: number }[]> {
        try {
            console.log("pop");
            const demographics = await this._repository.getUserDemographics();
            return demographics.map((demographic: any) => ({
                label: demographic._id,
                value: demographic.count,
            }));
        } catch (error) {
            console.error("Error in getUserDemographics:", error);
            throw new Error("Unable to fetch user demographics");
        }
    }

    async createPost(imageUrl: string[], caption: string, email: string): Promise<Post | null> {
        try {
            const userId = await this.findUserId(email);
            if (!userId) {
                throw new Error("User not found");
            }
            const newPost: Post = {
                imageUrl: imageUrl,
                caption,
                userId,
                createdAt: new Date(),
            };
            console.log(newPost);
            return await this._repository.uploadPost(newPost);
        } catch (error) {
            console.error("Error in createPost:", error);
            throw new Error("Unable to create post");
        }
    }

    async findUserPost(id: mongoose.Types.ObjectId): Promise<Post[] | null> {
        try {
            return await this._repository.fetchPost(id);
        } catch (error) {
            console.error("Error in findUserPost:", error);
            throw new Error("Unable to fetch user posts");
        }
    }

    async followProfile(email: string, id: string): Promise<User> {
        try {
            return await this._repository.followProfile(email, id);
        } catch (error) {
            console.error("Error in followProfile:", error);
            throw new Error("Unable to follow profile");
        }
    }

    async checkFollowingStatus(email: string, id: string): Promise<boolean> {
        try {
            const user = await this._repository.checkFollowingStatus(email, id);
            return !!user;
        } catch (error) {
            console.error("Error in checkFollowingStatus:", error);
            throw new Error("Unable to check following status");
        }
    }

    async fetchFeed(email: string, offset: number, limit: number): Promise<Post[] | null> {
        try {
            const userId = await this.findUserId(email);
            if (!userId) {
                return null;
            }
            const feed = await this._repository.fetchFeed(userId, offset, limit);
            return feed ?? null;
        } catch (error) {
            console.error("Error in fetchFeed:", error);
            throw new Error("Unable to fetch feed");
        }
    }

    async likePostAction(postsId: string, orginalUser: string): Promise<Post[] | null> {
        try {
            console.log("likePostAction", postsId);
            await this._repository.likePost(postsId, orginalUser);
            return null;
        } catch (error) {
            console.error("Error in likePostAction:", error);
            throw new Error("Unable to like post");
        }
    }

    async postComment(email: string, postId: string, postedComment: string): Promise<Comment> {
        try {
            return await this._repository.postComment(email, postedComment, postId);
        } catch (error) {
            console.error("Error in postComment:", error);
            throw new Error("Unable to post comment");
        }
    }

    async uploadStory(url: string, userId: string): Promise<boolean> {
        try {
            await this._repository.uploadStory(url, userId);
            return true;
        } catch (error) {
            console.error("Error in uploadStory:", error);
            throw new Error("Unable to upload story");
        }
    }

    async updateProfile(name: string, bio: string, email: string): Promise<boolean> {
        try {
            await this._repository.updateProfile(name, bio, email);
            return true;
        } catch (error) {
            console.error("Error in updateProfile:", error);
            throw new Error("Unable to update profile");
        }
    }

    async reportPost(reporterId: string, postId: string): Promise<void> {
        try {
            await this._repository.reportPost(reporterId, postId);
        } catch (error) {
            console.error("Error in reportPost:", error);
            throw new Error("Unable to report post");
        }
    }
    async fetchSavedPosts(username: string): Promise<any> {
        try {
            // Fetch user from _repository
            const user = await this._repository.findUserByUsername(username);
            if (!user) {
                throw new Error("User not found");
            }

            // Fetch saved posts
            const savedPostIds = user.savedPosts;
            const posts = await this._repository.findPostsByIds(savedPostIds);

            return { savedPosts: posts };
        } catch (error) {
            throw new Error(`Failed to fetch saved posts: ${error}`);
        }
    }

    async updateReadStatus(sender: string, recipient: string): Promise<any> {
        try {
            // Update the read status of messages
            const result = await this._repository.updateMessageReadStatus(sender, recipient);
            return result;
        } catch (error) {
            throw new Error(`Failed to update read status: ${error}`);
        }
    }

    async fetchHistoricalData(senderId: string, receiverId: string): Promise<any> {
        try {
            // Fetch historical messages between sender and receiver
            const messages = await this._repository.getHistoricalMessages(senderId, receiverId);
            return messages;
        } catch (error) {
            throw new Error(`Failed to fetch historical data: ${error}`);
        }
    }

    async getPremiumStatus(userId: string): Promise<any> {
        try {
            // Fetch the user and their roles to determine premium status
            const user = await this._repository.getUserById(userId);
            return user ? user.roles : null;
        } catch (error) {
            throw new Error(`Failed to fetch premium status: ${error}`);
        }
    }

    async getChatList(userId: string): Promise<any> {
        try {
            // Get the user by ID
            const user = await this._repository.getUserById(userId);
            if (!user) {
                throw new Error("User not found");
            }

            // Get the following and followers lists
            const following = user.following || [];
            const followers = user.followers || [];

            // Combine both arrays and remove duplicates (in case any user is in both lists)
            const combinedUsers = Array.from(new Set([...following, ...followers]));

            // Fetch the user details of these combined users
            const uniqueUsers = await this._repository.getUsersByIds(combinedUsers);

            return { uniqueUsers };
        } catch (error) {
            throw new Error(`Failed to fetch chat list: ${error}`);
        }
    }

    async visitPost(postId: string): Promise<any> {
        try {
            const result = await this._repository.getPostById(postId);
            const comments = await this._repository.getCommentsByPostId(postId);

            return { result, comments };
        } catch (error) {
            throw new Error(`Failed to visit post: ${error}`);
        }
    }

    async fetchStories(userId: string): Promise<any> {
        try {
            const followingList = await this._repository.getUserFollowing(userId);
            const stories = await this._repository.getStoriesByFollowingList(userId, followingList);

            return stories;
        } catch (error) {
            throw new Error(`Failed to fetch stories: ${error}`);
        }
    }

    async processAudioUpload(senderId: string, receiverId: string, audioUrl: string): Promise<void> {
        try {
            const audioMessageData = {
                sender: senderId,
                receiver: receiverId,
                message: audioUrl,
                type: "audio"
            };

            await this._repository.createMessage(audioMessageData);
        } catch (error) {
            throw new Error(`Failed to process audio upload: ${error}`);
        }
    }

    async execute(userId: string): Promise<any[]> {
        try {
            return await this._repository.getNotificationsByUserId(userId);
        } catch (error) {
            throw new Error(`Failed to execute notifications retrieval: ${error}`);
        }
    }

    async executeSavePost(userId: string, postId: string): Promise<{ message: string }> {
        try {
            const objectId = new mongoose.Types.ObjectId(postId);
            const user = await this._repository.findById(userId);

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

            await this._repository.saveUser(user);

            return { message: "Post saved/unsaved successfully" };
        } catch (error) {
            throw new Error(`Failed to save/unsave post: ${error}`);
        }
    }


    async getChartData(): Promise<{ chartData: ChartData[], chartConfig: ChartConfig }> {
        interface UserType {
            username: string;
            followerCount: number;
        }

        try {
            const data = await this._repository.getTopUsersByFollowers(3);

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
        } catch (error) {
            throw new Error("error at getChartData()")
        }
    }

} 
