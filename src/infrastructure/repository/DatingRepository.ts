import mongoose from "mongoose";
import { IDatingRepository, ProfileCompletionStatus } from "../../application/interface/IDatingRepository";
import CommentModel from "../database/model/CommentModel";
import DatingProfile from "../database/model/DatingProfileMode";
import { PostModel } from "../database/model/PostModel";
import Report from "../database/model/ReportModel";
import { Notification } from "../database/model/NotificationModel";
import UserModel from "../database/model/UserModel";

// export interface IDatingRepository {
//     swipeProfiles(userId: string, maximumAge: number, interestedGender: string): Promise<any>;
//     updateProfileImages(userId: string, url: string[]): Promise<any>;
//     fetchMatches(userId: string): Promise<any>;
//     getUserDatingProfile(userId: string): Promise<any>;
//     findUserById(userId: string): Promise<any>;
//     updateProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
//     createProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
//     saveUser(user: any): Promise<any>;
// }
interface Reply {
    _id: mongoose.Types.ObjectId;
    content: string;
    createdAt: Date;
    author: {
        profilePicture: string;
        username: string;
    };
}
export class DatingRepository implements IDatingRepository {
    async swipeProfiles(userId: string, maximumAge: number, interestedGender: string): Promise<any> {
        console.log(userId, maximumAge, interestedGender, "maximumage");

        try {
            // Verify if the user has images
            const user = await DatingProfile.findOne({ userId });
            if (!user || !user.images || user.images.length === 0) {
                console.log("User has no images, returning an empty profile list.");
                return [];  // Return an empty array if the user doesn't have images
            }
            if (!user.profileVisibility) {
                return []
            }

            // Fetch profiles based on provided filters
            const profiles = await DatingProfile.find({
                userId: { $ne: userId },
                profileVisibility: true,
                age: { $lte: maximumAge },
                gender: interestedGender,
                likedByUsers: { $ne: userId },
                images: { $ne: [] }  // Filter out profiles with an empty images array
            });

            console.log(profiles, "profiles");
            return profiles;
        } catch (error) {
            console.error("Error fetching swipe profiles:", error);
            throw new Error("Failed to fetch swipe profiles. Please try again later.");
        }
    }



    async updateProfileImages(userId: string, url: string[]): Promise<any> {
        try {
            const profile = await DatingProfile.findOne({ userId });
            if (!profile) {
                throw new Error("Profile not found");
            }
            profile.images = url;
            await profile.save();
            return {};
        } catch (error) {
            console.error("Error updating profile images:", error);
            throw new Error("Failed to update profile images. Please try again later.");
        }
    }

    async fetchMatches(userId: string): Promise<any> {
        try {
            const matches = await DatingProfile.find({
                userId: { $ne: userId },  // Exclude the current user's profile
                likedUsers: userId,  // The current user has liked these profiles
                likedByUsers: userId  // These profiles have also liked the current user
            }).populate('userId');
            return matches;
        } catch (error) {
            console.error("Error fetching matches:", error);
            throw new Error("Failed to fetch matches. Please try again later.");
        }
    }
    async fetchPostDetails(postId: string): Promise<any> {
        try {
            const post = await PostModel.findById(postId)
            return post
        } catch (error) {
            console.error('Not able to fetch post details')
            throw new Error
        }
    }
    async getCommentById(commentId: string): Promise<any> {
        //valid
        try {
            const comment = await CommentModel.findById(commentId)
            return comment
        } catch (error) {
            console.error('error fetching comment details')
            throw new Error
        }
    }

    async getUserDatingProfile(userId: string): Promise<any> {
        try {
            const profile = await DatingProfile.findOne({ userId });
            if (!profile) {
                throw new Error("Profile not found");
            }
            return profile;
        } catch (error) {
            console.error("Error fetching user dating profile:", error);
            throw new Error("Failed to fetch user dating profile. Please try again later.");
        }
    }

    async findUserById(userId: string): Promise<any> {
        try {
            const profile = await DatingProfile.findOne({ userId });
            if (!profile) {
                // throw new Error("User not found");
                return
            }
            return profile;
        } catch (error) {
            console.error("Error finding user by ID:", error);
            throw new Error("Failed to find user by ID. Please try again later.");
        }
    }

    async updateProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any> {
        try {
            const result = await DatingProfile.updateOne(
                { userId },
                {
                    $set: {
                        name: formData.name,
                        age: formData.age,
                        bio: formData.bio,
                        gender: formData.gender
                    }
                }
            );
            // if (result.nModified === 0) {
            //     throw new Error("No profile updated");
            // }
            return result;
        } catch (error) {
            console.error("Error updating profile:", error);
            throw new Error("Failed to update profile. Please try again later.");
        }
    }

    async createProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any> {
        try {
            const profile = new DatingProfile({
                userId,
                name: formData.name,
                age: formData.age,
                bio: formData.bio,
                gender: formData.gender
            });
            return await profile.save();
        } catch (error) {
            console.error("Error creating profile:", error);
            throw new Error("Failed to create profile. Please try again later.");
        }
    }

    async saveUser(user: any): Promise<any> {
        console.log(user, "iii");
        try {
            return await user.save();
        } catch (error) {
            console.error("Error saving user:", error);
            throw new Error("Failed to save user. Please try again later.");
        }
    }
    async findReportById(id: string): Promise<void> {
        try {
            await Report.findByIdAndDelete(id)
        } catch (error) {
            console.error("Error saving user:", error);
            throw new Error("Failed to save user. Please try again later.");
        }
    }
    async deleteComment(commentId: string): Promise<void> {
        try {
            await CommentModel.findByIdAndDelete(commentId)
        } catch (error) {
            console.error("Error saving user:", error);
            throw new Error("Failed to save user. Please try again later.");
        }
    }
    async deletePost(postId: string): Promise<void> {
        try {
            await PostModel.findByIdAndDelete(postId)

        } catch (error) {
            console.error("Error delete post:", error);
            throw new Error("Failed to delete post. Please try again later.");
        }
    }

    async fetchPostComment(postId: string): Promise<any> {


        try {
            const comments = await CommentModel.aggregate([
                {
                    $match: { postId: new mongoose.Types.ObjectId(postId) }
                },
                {
                    $sort: { createdAt: -1 }
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'userId',
                        foreignField: '_id',
                        as: 'user'
                    }
                },
                { $unwind: '$user' },
                {

                    $lookup: {
                        from: 'users',
                        localField: 'replies.userId',
                        foreignField: '_id',
                        as: 'replyUser'
                    }
                },
                {
                    $addFields: {

                        replies: {
                            $map: {
                                input: '$replies',
                                as: 'reply',
                                in: {
                                    _id: '$$reply._id',
                                    content: '$$reply.content',
                                    createdAt: '$$reply.createdAt',
                                    userId: '$$reply.userId',

                                    author: {
                                        $arrayElemAt: [
                                            {
                                                $filter: {
                                                    input: '$replyUser',
                                                    as: 'ru',
                                                    cond: { $eq: ['$$ru._id', '$$reply.userId'] }
                                                }
                                            }, 0
                                        ]
                                    }
                                }
                            }
                        }
                    }
                },
                {

                    $project: {
                        _id: 1,
                        content: 1,
                        'user.profilePicture': 1,
                        'user.username': 1,
                        replies: {
                            _id: 1,
                            content: 1,
                            createdAt: 1,
                            'author.profilePicture': '$replies.author.profilePicture',
                            'author.username': '$replies.author.username'
                        }
                    }
                }
            ]);

            const formattedComments = comments.map(comment => ({
                _id: comment._id,
                content: comment.content,
                avatar: comment.user.profilePicture,
                author: comment.user.username,
                replies: comment.replies.map((reply: Reply) => ({
                    _id: reply._id,
                    content: reply.content,
                    createdAt: reply.createdAt,
                    avatar: reply.author.profilePicture,
                    author: reply.author.username
                }))
            }));
            console.log(formattedComments);

            return formattedComments
        } catch (error) {
            console.log('Error fetching comments:', error);
            throw new Error
        }
    }
    async findUser(userId: string): Promise<any> {
        try {
            return await UserModel.findById(userId);
        } catch (error) {
            console.error("Error finding user:", error);
            throw error;
        }
    }

    async findPostById(postId: string): Promise<any> {
        try {
            return await PostModel.findById(postId);
        } catch (error) {
            console.error("Error finding post by ID:", error);
            throw error;
        }
    }

    async saveComment(commentData: any): Promise<any> {
        try {
            const comment = new CommentModel(commentData);
            return await comment.save();
        } catch (error) {
            console.error("Error saving comment:", error);
            throw error;
        }
    }

    async createNotification(notificationData: any): Promise<any> {
        try {
            const notification = new Notification(notificationData);
            return await notification.save();
        } catch (error) {
            console.error("Error creating notification:", error);
            throw error;
        }
    }

    async getRepliesWithUserData(commentId: string): Promise<any> {
        try {
            return await CommentModel.aggregate([
                {
                    $match: { _id: new mongoose.Types.ObjectId(commentId) }
                },
                {
                    $unwind: "$replies"
                },
                {
                    $lookup: {
                        from: 'users',
                        localField: 'replies.userId',
                        foreignField: '_id',
                        as: 'replyUser'
                    }
                },
                {
                    $addFields: {
                        "replies.author": { $arrayElemAt: ["$replyUser", 0] }
                    }
                },
                {
                    $project: {
                        "replies._id": 1,
                        "replies.content": 1,
                        "replies.createdAt": 1,
                        "replies.author.profilePicture": "$replies.author.profilePicture",
                        "replies.author.username": "$replies.author.username"
                    }
                }
            ]);
        } catch (error) {
            console.error("Error getting replies with user data:", error);
            throw error;
        }
    }

    async deleteCommentReply(parentCommentId: string, comment: any) {
        try {


            // Update the document and remove the reply
            const result = await CommentModel.updateOne(
                { _id: parentCommentId },
                {
                    $pull: {
                        replies: { _id: comment._id }
                    }
                }
            );
            return result
        } catch (error) {
            console.error("Error deleteCommentReply:", error);
            throw new Error("Failed deleteCommentReply. Please try again later.");
        }
    }
    async likedUserDetails(likedUsersId: any): Promise<any> {
        try {
            const LikedUsers = await UserModel.find({

                _id: { $in: likedUsersId }
            })
            return LikedUsers
        } catch (error) {
            console.error("Error likedUserDetails:", error);
            throw new Error("Failed likedUserDetails. Please try again later.");
        }
    }

    async postAlreadyReported(postId: any, victimUser: any): Promise<any> {
        try {
            const existingReport = await Report.findOne({
                postId: postId,
                reporterId: victimUser
            });
            return existingReport
        } catch (error) {
            console.error("Error postAlreadyReported:", error);
            throw new Error("Failed postAlreadyReported. Please try again later.");
        }
    }

    async userPostedReply(content: any, userId: any, postId: any, parentId: any): Promise<any> {
        try {
            const user = await UserModel.findById(userId);
            if (!user) throw new Error
            const objectIdParentId = new mongoose.Types.ObjectId(parentId);

            // Fetch the parent comment using the parentId
            const parentComment = await CommentModel.findById(objectIdParentId);
            if (!parentComment) {
                console.log("Parent comment not found");
                throw new Error
            }

            // Create the new reply object
            const reply = {
                _id: new mongoose.Types.ObjectId(), // Generate a unique _id for the reply
                userId,
                content,
                createdAt: new Date(),
                author: {
                    profilePicture: user.profilePicture, // Attach user's profile picture
                    username: user.username              // Attach user's username
                }
            };

            // Push the reply into the replies array of the parent comment
            parentComment.replies.push(reply);

            // Save the updated parent comment with the new reply
            await parentComment.save();

            // Format the reply for the response
            const formattedReply = {
                _id: reply._id,
                content: reply.content,
                createdAt: reply.createdAt,
                avatar: reply.author.profilePicture, // Include avatar in the response
                author: reply.author.username        // Include author username in the response
            };

            // Send the formatted reply back to the frontend
            return formattedReply

        } catch (error) {
            console.error("Error userPostedReply:", error);
            throw new Error("Failed userPostedReply. Please try again later.");
        }
    }
    async profileCompletionStatus(userId: string): Promise<ProfileCompletionStatus> {
        try {
            const profile = await DatingProfile.findOne({ userId });

            if (!profile) {
                throw new Error
            }

            // Using <any> to bypass TypeScript's strict property checks
            const requiredFields = ["name", "age", "bio", "images", "gender", "profileVisibility", "maximumAge", "interestedGender"];
            const isProfileComplete = requiredFields.every(field => {
                const value = (profile as any)[field];
                return value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0) && value !== '';
            });

            return {
                profile,
                isProfileComplete
            }
        } catch (error) {
            console.error("Error saving profileCompletionStatus:", error);
            throw new Error("Failed to save profileCompletionStatus. Please try again later.");
        }
    }

    async profileVisibility(userId: string, profileVisibility: boolean): Promise<any> {
        try {
            const profile = await DatingProfile.findOne({ userId })
            if (!profile) {
                throw new Error
            }
            profile.profileVisibility = profileVisibility
            await profile.save()
        } catch (error) {
            console.error('error in profile visibility')
            throw new Error('error in profile visibiliy')
        }
    }



}

