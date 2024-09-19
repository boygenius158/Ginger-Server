import mongoose, { Types } from "mongoose";
import { IMediaRepository } from "../../application/interface/IMediaRepository";
import { Post } from "../../domain/entities/Post";
import { User } from "../../domain/entities/User";
import UserModel from "../database/model/UserModel";
import { PostModel } from "../database/model/PostModel";
import { userInfo } from "os";
import { Comment } from "../../domain/entities/Comment";
import CommentModel from "../database/model/CommentModel";
import StoryModel from "../database/model/StoryModel";
import { Notification } from "../database/model/NotificationModel";
import { Socket } from "socket.io";
import Report from "../database/model/ReportModel";
import Message from "../database/model/MessageModel";
import { PremiumModel } from "../database/model/PremiumModel";

export class MediaRepository implements IMediaRepository {
    async getUserDemographics(): Promise<{ _id: string; count: number }[]> {
        console.log("ys");

        return await UserModel.aggregate([
            {
                $group: {
                    _id: "$roles",
                    count: { $sum: 1 }
                }
            }
        ]);
    }
    async findUserByUsername(username: string): Promise<any> {
        return await UserModel.findOne({ username: username });
    }

    async findPostsByIds(postIds: string[]): Promise<any[]> {
        return await PostModel.find({ _id: { $in: postIds } }).sort({ _id: -1 });
    }

    async reportPost(reporterId: string, postId: string): Promise<void> {
        const report = new Report({
            reporterId,
            postId,
        });
        await report.save();
    }
    async findUserById(userId: string): Promise<any> {
        return UserModel.findById(userId).exec();
    }
    async findPremiumByUserId(userId: string): Promise<any> {
        return PremiumModel.findOne({ userId }).exec();
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
            console.log("iiiiiii");

            const user = await UserModel.findOne({ email });
            if (!user) {
                throw new Error("User not2 found");
            }
            return user.id;
        } catch (error) {
            console.error("Error finding user by email:", error);
            return null;
        }
    }

    async findUserIdByUsername(username: string): Promise<User | null> {
        try {
            const user = await UserModel.findOne({ username });
            if (!user) {
                throw new Error("User not found");
            }
            return user;
        } catch (error) {
            console.error("Error finding user by username:", error);
            return null;
        }
    }

    async fetchPost(userId: Types.ObjectId): Promise<Post[]> {
        try {
            const posts = await PostModel.find({ userId }).sort({ _id: -1 })

            return posts.map(post => post.toObject());
        } catch (error) {
            console.error("Error finding posts by user ID:", error);
            return [];
        }
    }
    async followProfile(email: string, id: string): Promise<User> {
        try {
            // Convert the id string to ObjectId
            const objectId = new mongoose.Types.ObjectId(id);

            // Find users
            const user = await UserModel.findOne({ email });
            const user2 = await UserModel.findById(objectId); // Convert id to ObjectId

            if (!user) {
                throw new Error('User not found');
            }
            if (!user2) {
                throw new Error('User not found');
            }

            // Initialize the following and followers arrays if they are undefined
            if (!user.following) {
                user.following = [];
            }
            if (!user2.followers) {
                user2.followers = [];
            }

            // Toggle follow/unfollow
            const alreadyFollowing = user.following.some(followedId => followedId.equals(objectId));

            if (alreadyFollowing) {
                // Remove from following and followers
                user.following = user.following.filter(followedId => !followedId.equals(objectId));
                user2.followers = user2.followers.filter(followerId => !followerId.equals(objectId));
            } else {
                // Add to following and followers
                user.following.push(objectId);
                user2.followers.push(objectId);
            }

            // Save changes to both users
            const updatedUser = await user.save();
            await user2.save(); // Save changes for user2

            return updatedUser;
        } catch (error) {
            console.error("Error following profile:", error);
            throw new Error('Error following profile');
        }
    }

    async checkFollowingStatus(email: string, id: string): Promise<boolean> {
        try {
            const user = await UserModel.findOne({ email })
            if (!user) {
                throw new Error
            }
            const objectId = new mongoose.Types.ObjectId(id)
            return user.following?.includes(objectId) ?? false;

        } catch (error) {
            console.error("Error following profile:", error);
            throw new Error
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
            const savedPosts = user.savedPosts

            const posts = await PostModel.aggregate([
                {
                    $match: {
                        $or: [
                            { userId: objectId },
                            { userId: { $in: following } }
                        ],
                        isBanned: false
                    },
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'userDetails',
                    },
                },
                {
                    $unwind: '$userDetails',
                },
                {
                    $addFields: {
                        isSaved: {
                            $in: ['$_id', savedPosts]
                        }
                    }
                },
                {
                    $project: {
                        _id: 1,
                        imageUrl: 1,
                        caption: 1,
                        userId: 1,
                        likeCount: 1,
                        likes: 1,
                        createdAt: 1,
                        'userDetails.username': 1,
                        'userDetails.email': 1,
                        'userDetails.profilePicture': 1,
                        isSaved: 1

                    },
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $skip: offset,
                },
                {
                    $limit: limit,
                }
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
            const userWhoLikePost = await UserModel.findById(OoriginalUser)
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
                post.likeCount = Math.max((post.likeCount || 0) - 1, 0);
            } else {
                post.likes.push(OoriginalUser);
                post.likeCount = (post.likeCount || 0) + 1;
            }
            await post.save();

            return true;
        } catch (error) {
            console.error('Failed to like/unlike post:', error);
            return false;
        }
    }


    async postComment(email: string, postId: string, postedComment: string): Promise<Comment> {
        console.log(postId);

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
    }

    async uploadStory(url: string, userId: string): Promise<boolean> {
        console.log("reached");

        const objectId = new mongoose.Types.ObjectId(userId)
        const story = new StoryModel({
            imageUrl: url,
            userId: objectId
        })
        await story.save()
        return true

    }

    async updateProfile(name: string, bio: string, email: string): Promise<boolean> {
        const user = await UserModel.findOne({ email })
        if (!user) {
            console.log("user not found");
            throw new Error('user not found')
        }
        console.log(user);
        user.bio = bio
        user.name = name
        await user.save()
        return true
    }
    async updateMessageReadStatus(sender: string, recipient: string): Promise<any> {
        return await Message.updateMany(
            {
                $or: [
                    { sender: recipient, receiver: sender },
                ],
                isRead: false
            },
            {
                $set: { isRead: true }
            }
        );
    }
    async getHistoricalMessages(senderId: string, receiverId: string): Promise<any> {
        return await Message.find({
            $or: [
                { sender: senderId, receiver: receiverId },
                { sender: receiverId, receiver: senderId },
            ]
        }).sort({ timestamp: 1 });
    }
    async getUserById(userId: string): Promise<any> {
        return await UserModel.findById(userId);
    }
    async getUsersByIds(userIds: string[]): Promise<any[]> {
        return await UserModel.find({ _id: { $in: userIds } });
    }
    async getPostById(postId: string): Promise<any> {
        return await PostModel.findById(postId).populate('userId');
    }

    async getCommentsByPostId(postId: string): Promise<any[]> {
        return await CommentModel.find({ postId }).populate('userId');
    }
    async getUserFollowing(userId: string): Promise<string[]> {
        const user = await UserModel.findById(userId).select('following');
        if (!user) {
            throw new Error('User not found');
        }

        // Provide an empty array if following is undefined
        const followingList = user.following ?? [];

        // Convert ObjectId to string
        return followingList.map(id => id.toString());
    }

    async getStoriesByFollowingList(followingList: string[]): Promise<any[]> {
        return await StoryModel.aggregate([
            { $match: { userId: { $in: followingList.map(id => new mongoose.Types.ObjectId(id)) } } },
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
    }
    async createMessage(messageData: any): Promise<any> {
        const newMessage = new Message(messageData);
        return newMessage.save();
    }
    async getNotificationsByUserId(userId: string): Promise<any[]> {
        return Notification.find({ user: userId })
            .populate('interactorId', 'username profilePicture')
            .exec();
    }
    async findById(userId: string): Promise<any | null> {
        return UserModel.findById(userId).exec();
    }

    async saveUser(user: any): Promise<void> {
        await user.save();
    }
    async getTopUsersByFollowers(limit: number): Promise<any[]> {
        return UserModel.aggregate([
            { $match: { roles: { $ne: 'admin' } } },
            { $project: { _id: 0, username: 1, followerCount: { $size: { $ifNull: ['$followers', []] } } } },
            { $sort: { followerCount: -1 } },
            { $limit: limit }
        ]).exec();
    }
}          