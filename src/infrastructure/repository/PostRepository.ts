import mongoose, { Types } from "mongoose";
import { IPostRepository } from "../../application/interface/IPostRepository";
import { Post } from "../../domain/entities/Post";
import { User } from "../../domain/entities/User";
import UserModel from "../database/model/UserModel";
import { PostModel } from "../database/model/PostModel";
import { Comment } from "../../domain/entities/Comment";
import CommentModel from "../database/model/CommentModel";
import StoryModel from "../database/model/StoryModel";
import { Notification } from "../database/model/NotificationModel";
import Report from "../database/model/ReportModel";
import Message from "../database/model/MessageModel";
import { PremiumModel } from "../database/model/PremiumModel";

export class PostRepository implements IPostRepository {
    async getUserDemographics(): Promise<{ _id: string; count: number }[]> {
        try {
            console.log("ys");
            return await UserModel.aggregate([
                {
                    $match: {
                        roles: {
                            $ne: "admin"
                        }
                    }
                },
                {
                    $group: {
                        _id: "$roles",
                        count: { $sum: 1 }
                    }
                }
            ]);
        } catch (error) {
            console.error("Error fetching user demographics:", error);
            return [];
        }
    }

    async findUserByUsername(username: string): Promise<any> {
        try {
            return await UserModel.findOne({ username });
        } catch (error) {
            console.error("Error finding user by username:", error);
            return null;
        }
    }

    async findPostsByIds(postIds: string[]): Promise<any[]> {
        try {
            return await PostModel.find({ _id: { $in: postIds } }).sort({ _id: -1 });
        } catch (error) {
            console.error("Error finding posts by IDs:", error);
            return [];
        }
    }

    async reportPost(reporterId: string, postId: string): Promise<void> {
        try {
            const report = new Report({
                reporterId,
                postId,
            });
            await report.save();
        } catch (error) {
            console.error("Error reporting post:", error);
        }
    }

    async findUserById(userId: string): Promise<any> {
        try {
            return await UserModel.findById(userId).exec();
        } catch (error) {
            console.error("Error finding user by ID:", error);
            return null;
        }
    }

    async findPremiumByUserId(userId: string): Promise<any> {
        try {
            return await PremiumModel.findOne({ userId }).exec();
        } catch (error) {
            console.error("Error finding premium user by ID:", error);
            return null;
        }
    }

    async uploadPost(post: Post): Promise<Post | null> {
        try {
            const { imageUrl, caption, userId } = post;

            const newPost = new PostModel({
                caption,
                imageUrl,
                userId
            });

            await newPost.save();

            return newPost.toObject();
        } catch (error) {
            console.error("Error uploading post:", error);
            return null;
        }
    }

    async findUserId(email: string): Promise<string | null> {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error("User not found");
            }
            return user.id;
        } catch (error) {
            console.error("Error finding user by email:", error);
            return null;
        }
    }

    async findUserIdByUsername(username: string): Promise<User | null> {
        try {
            // const user = await UserModel.findOne({ username });
            const user = await UserModel.aggregate([
                {
                    $match: { username } // Match the user document by username
                },
                {
                    $lookup: {
                        from: "users", // Assuming your users are stored in the "users" collection
                        localField: "followers",
                        foreignField: "_id",
                        as: "followerDetails"
                    }
                },
                {
                    $lookup: {
                        from: "users", // Assuming your users are stored in the "users" collection
                        localField: "following",
                        foreignField: "_id",
                        as: "followingDetails"
                    }
                },
                {
                    $project: {
                        username: 1,
                        email: 1,
                        name: 1,
                        bio: 1,
                        roles: 1,
                        followers: 1,
                        following: 1,
                        profilePicture: 1,
                        followerDetails: { username: 1, profilePicture: 1, followers: 1 },
                        followingDetails: { username: 1, profilePicture: 1, following: 1 }
                    }
                }
            ]);

            if (!user) {
                throw new Error("User not found");
            }
            console.log(user);

            return user[0]
        } catch (error) {
            console.error("Error finding user by username:", error);
            return null;
        }
    }

    // async fetchPost(userId: Types.ObjectId): Promise<Post[]> {
    //     try {
    //         // const posts = await PostModel.find({ userId }).sort({ _id: -1 });
    //         const posts = await PostModel.aggregate([
    //             {
    //                 $match: {
    //                     userId
    //                 }
    //             },
    //             {
    //                 $lookup: {
    //                     from: 'users',
    //                     localField: "userId",
    //                     foreignField: "_id",
    //                     as: "userDetails"
    //                 }
    //             },
    //             {
    //                 $unwind: '$userDetails'
    //             },
    //             {
    //                 $project: {
    //                     ...PostModel.schema.obj,
    //                     "userDetails.username": 1,
    //                     "userDetails.profilePicture": 1

    //                 }
    //             }
    //         ])
    //         return posts.map(post => post.toObject());
    //     } catch (error) {
    //         console.error("Error fetching posts by user ID:", error);
    //         return [];
    //     }
    // }
    async fetchPost(userId: Types.ObjectId): Promise<Post[]> {
        try {
            const posts = await PostModel.find({ userId }).sort({ _id: -1 });
            return posts.map(post => post.toObject());
        } catch (error) {
            console.error("Error fetching posts by user ID:", error);
            return [];
        }
    }


    async followProfile(email: string, id: string): Promise<User> {
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                throw new Error('Invalid user ID format');
            }
            const objectId = new mongoose.Types.ObjectId(id);

            const user = await UserModel.findOne({ email });
            const user2 = await UserModel.findById(objectId);
            console.log(user, user2);

            if (!user) {
                throw new Error('User not found');
            }
            if (!user2) {
                throw new Error('Profile to follow not found');
            }

            user.following = user.following || [];
            user2.followers = user2.followers || [];

            const alreadyFollowing = user.following.some(followedId => followedId.equals(user2._id));

            if (alreadyFollowing) {
                user.following = user.following.filter(followedId => !followedId.equals(user2._id));
                user2.followers = user2.followers.filter(followerId => !followerId.equals(user._id));
            } else {
                user.following.push(objectId);
                user2.followers.push(user._id);
                const message = `${user.username} started following you`
                const notification = new Notification({
                    user: user2._id,
                    interactorId: user._id,
                    type: 'follow',
                    message: message
                })
                await notification.save()
            }

            const updatedUser = await user.save();
            await user2.save();
            return updatedUser;
        } catch (error) {
            console.error("Error following profile:", error);
            throw new Error('Error following profile');
        }
    }

    async checkFollowingStatus(email: string, id: string): Promise<boolean> {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }
            const objectId = new mongoose.Types.ObjectId(id);
            return user.following?.includes(objectId) ?? false;
        } catch (error) {
            console.error("Error checking following status:", error);
            throw new Error('Error checking following status');
        }
    }

    async fetchFeed(userId: string, offset: number, limit: number): Promise<Post[] | null> {
        try {
            const objectId = new mongoose.Types.ObjectId(userId);
            const user = await UserModel.findById(objectId);
            if (!user) {
                console.error('User not found');
                return null;
            }

            const following = user.following;
            const savedPosts = user.savedPosts;

            const posts = await PostModel.aggregate([
                { $match: { $or: [{ userId: objectId }, { userId: { $in: following } }], isBanned: false } },
                { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'userDetails' } },
                { $unwind: '$userDetails' },
                { $addFields: { isSaved: { $in: ['$_id', savedPosts] } } },
                // { $project: { _id: 1, imageUrl: 1, caption: 1, userId: 1, likeCount: 1, likes: 1, createdAt: 1, 'userDetails.username': 1, 'userDetails.email': 1, 'userDetails.profilePicture': 1, 'userDetails.followers': 1, 'userDetails.following': 1, 'userDetails.createdAt': 1, isSaved: 1 } },
                { $project: { _id: 1, imageUrl: 1, caption: 1, userId: 1, likes: 1, createdAt: 1, 'userDetails.username': 1, 'userDetails.email': 1, 'userDetails.profilePicture': 1, 'userDetails.followers': 1, 'userDetails.following': 1, 'userDetails.createdAt': 1, isSaved: 1 } },

                { $sort: { createdAt: -1 } },
                { $skip: offset },
                { $limit: limit }
            ]);

            return posts;
        } catch (error) {
            console.error('Failed to fetch feed:', error);
            return null;
        }
    }

    async likePost(postsId: string, originalUser: string): Promise<boolean> {
        try {
            const OpostId = new mongoose.Types.ObjectId(postsId);
            const OoriginalUser = new mongoose.Types.ObjectId(originalUser);
            const userWhoLikePost = await UserModel.findById(OoriginalUser);
            const post = await PostModel.findById(OpostId);
            if (!post) {
                return false;
            }
            if (!post.likes) {
                post.likes = [];
            }
            const hasLiked = post.likes.includes(OoriginalUser);
            if (hasLiked) {
                post.likes = post.likes.filter(like => !like.equals(OoriginalUser));
                // post.likeCount = Math.max((post.likeCount || 0) - 1, 0);
            } else {
                post.likes.push(OoriginalUser);
                // post.likeCount = (post.likeCount || 0) + 1;
            }
            await post.save();

            return true;
        } catch (error) {
            console.error('Failed to like/unlike post:', error);
            return false;
        }
    }

    async postComment(email: string, postId: string, postedComment: string): Promise<Comment> {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            if (!mongoose.Types.ObjectId.isValid(postId)) {
                throw new Error('Invalid postId');
            }

            const objectId = new mongoose.Types.ObjectId(postId);
            const comment = new CommentModel({
                userId: user._id,
                postId: objectId,
                content: postedComment,
            });

            const savedComment = await comment.save();
            return savedComment as Comment;
        } catch (error) {
            console.error('Failed to post comment:', error);
            throw new Error('Failed to post comment');
        }
    }

    async uploadStory(url: string, userId: string): Promise<boolean> {
        try {
            const objectId = new mongoose.Types.ObjectId(userId);
            const story = new StoryModel({
                imageUrl: url,
                userId: objectId
            });
            await story.save();
            return true;
        } catch (error) {
            console.error('Failed to upload story:', error);
            return false;
        }
    }

    async updateProfile(name: string, bio: string, email: string): Promise<boolean> {
        try {
            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }

            user.bio = bio;
            user.name = name;
            await user.save();
            return true;
        } catch (error) {
            console.error('Failed to update profile:', error);
            return false;
        }
    }

    async updateMessageReadStatus(sender: string, recipient: string): Promise<any> {
        try {
            return await Message.updateMany(
                { $or: [{ sender: recipient, receiver: sender }], isRead: false },
                { $set: { isRead: true } }
            );
        } catch (error) {
            console.error('Failed to update message read status:', error);
            throw new Error('Failed to update message read status');
        }
    }

    async getHistoricalMessages(senderId: string, receiverId: string): Promise<any> {
        try {
            return await Message.find({
                $or: [
                    { sender: senderId, receiver: receiverId },
                    { sender: receiverId, receiver: senderId }
                ]
            }).sort({ timestamp: 1 });
        } catch (error) {
            console.error('Failed to fetch historical messages:', error);
            throw new Error('Failed to fetch historical messages');
        }
    }

    async getUserById(userId: string): Promise<any> {
        try {
            return await UserModel.findById(userId);
        } catch (error) {
            console.error('Failed to get user by ID:', error);
            throw new Error('Failed to get user by ID');
        }
    }

    async getUsersByIds(userIds: string[]): Promise<any[]> {
        try {
            return await UserModel.find({ _id: { $in: userIds } });
        } catch (error) {
            console.error('Failed to get users by IDs:', error);
            throw new Error('Failed to get users by IDs');
        }
    }

    async getPostById(postId: string): Promise<any> {
        try {
            return await PostModel.findById(postId).populate('userId');
        } catch (error) {
            console.error('Failed to get post by ID:', error);
            throw new Error('Failed to get post by ID');
        }
    }

    async getFollowers(userId: string): Promise<any[]> {
        try {
            return await UserModel.find({ following: userId });
        } catch (error) {
            console.error('Failed to get followers:', error);
            throw new Error('Failed to get followers');
        }
    }

    async getCommentsByPostId(postId: string): Promise<any[]> {
        try {
            return await CommentModel.find({ postId })
                .populate('userId')
                .populate({
                    path: 'replies.userId',
                    select: 'username profilePicture'
                });
        } catch (error) {
            console.error('Failed to get comments by post ID:', error);
            throw new Error('Failed to get comments by post ID');
        }
    }






    async getUserFollowing(userId: string): Promise<string[]> {
        try {
            const user = await UserModel.findById(userId).select('following');
            if (!user) {
                throw new Error('User not found');
            }

            // Provide an empty array if following is undefined
            const followingList = user.following ?? [];

            // Convert ObjectId to string
            return followingList.map(id => id.toString());
        } catch (error) {
            console.error(`Error fetching following list for userId ${userId}:`, error);
            throw new Error('Failed to get user following list');
        }
    }

    async getStoriesByFollowingList(owner: string, followingList: string[]): Promise<any[]> {
        try {
            return await StoryModel.aggregate([
                {
                    $match: {
                        userId: {
                            $in: [
                                new mongoose.Types.ObjectId(owner), // Include the owner
                                ...followingList.map(id => new mongoose.Types.ObjectId(id)) // Include following list
                            ]
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails'
                    }
                },
                { $unwind: '$userDetails' },
                {
                    $project: {
                        _id: 1,
                        userId: 1,
                        imageUrl: 1,
                        createdAt: 1,
                        'userDetails.username': 1,
                        'userDetails.profilePicture': 1
                    }
                }
            ]);
        } catch (error) {
            console.error(`Error fetching stories for owner ${owner} and following list:`, error);
            throw new Error('Failed to get stories');
        }
    }

    async createMessage(messageData: any): Promise<any> {
        try {
            const newMessage = new Message(messageData);
            return await newMessage.save();
        } catch (error) {
            console.error('Error creating message:', error);
            throw new Error('Failed to create message');
        }
    }

    async getNotificationsByUserId(userId: string): Promise<any[]> {
        try {
            return await Notification.find({ user: userId })
                .populate('interactorId', 'username profilePicture')
                .sort({ createdAt: -1 })
                .limit(20)
                .exec();
        } catch (error) {
            console.error(`Error fetching notifications for userId ${userId}:`, error);
            throw new Error('Failed to get notifications');
        }
    }


    async findById(userId: string): Promise<any | null> {
        try {
            return await UserModel.findById(userId).exec();
        } catch (error) {
            console.error(`Error fetching user by ID ${userId}:`, error);
            throw new Error('Failed to find user');
        }
    }

    async saveUser(user: any): Promise<void> {
        try {
            await user.save();
        } catch (error) {
            console.error('Error saving user:', error);
            throw new Error('Failed to save user');
        }
    }

    async getTopUsersByFollowers(limit: number): Promise<any[]> {
        try {
            return await UserModel.aggregate([
                { $match: { roles: { $ne: 'admin' } } },
                { $project: { _id: 0, username: 1, followerCount: { $size: { $ifNull: ['$followers', []] } } } },
                { $sort: { followerCount: -1 } },
                { $limit: limit }
            ]).exec();
        } catch (error) {
            console.error(`Error fetching top users by followers with limit ${limit}:`, error);
            throw new Error('Failed to get top users');
        }
    }

}          