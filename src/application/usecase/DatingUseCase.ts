
import { IDatingRepository, ProfileCompletionStatus } from "../interface/IDatingRepository";
import { IDatingUseCase } from "../interface/IDatingUseCase";

// export interface IDatingUseCase {
//     swipeProfiles(userId: string): Promise<any>;
//     updateProfileImages(userId: string, url: string[]): Promise<any>;
//     fetchMatches(userId: string): Promise<any>;
//     getUserDatingProfile(userId: string): Promise<any>;
//     handleDatingTab1(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
//     getProfileImages(userId: string): Promise<string[] | null>;
//     updateUserPreferences(userId: string, maximumAge: number, profileVisibility: boolean, interestedGender: string): Promise<any>;
//     getUserSettings(userId: string): Promise<any>;
//     getDatingTab1Details(userId: string): Promise<any>;
//     adminDeleteRecord(id: string): Promise<void>
//     deleteComment(commentId: string): Promise<void>
//     deletePost(postId: string): Promise<void>
//     fetchPostComment(postId: string): Promise<any>
//     executed(content: string, userId: string, postId: string): Promise<any>;
//     deleteCommentReply(parentCommentId: string, comment: any): Promise<any>
//     likedUserDetails(likedUsersId: any): Promise<any>
//     postAlreadyReported(postId: any, victimUser: any): Promise<any>
//     userPostedReply(content:any, userId:any, postId:any, parentId:any): Promise<any>


// }

export class DatingUseCase implements IDatingUseCase {
    private _repository: IDatingRepository;

    constructor(_repository: IDatingRepository) {
        this._repository = _repository;
    }

    async swipeProfiles(userId: string,): Promise<any> {
        try {
            const datingProfile = await this._repository.getUserDatingProfile(userId);
            console.log(datingProfile.name);
            const profiles = await this._repository.swipeProfiles(userId, datingProfile.maximumAge, datingProfile.interestedGender);
            return profiles;
        } catch (error) {
            console.error("Error while swiping profiles:", error);
            throw new Error("Failed to swipe profiles");
        }
    }

    async updateProfileImages(userId: string, url: string[]): Promise<any> {
        try {
            await this._repository.updateProfileImages(userId, url);
            return {};
        } catch (error) {
            console.error("Error updating profile images:", error);
            throw new Error("Failed to update profile images");
        }
    }

    async fetchMatches(userId: string): Promise<any> {
        try {
            const matches = await this._repository.fetchMatches(userId);
            return matches;
        } catch (error) {
            console.error("Error fetching matches:", error);
            throw new Error("Failed to fetch matches");
        }
    }

    async getUserDatingProfile(userId: string): Promise<any> {
        try {
            const profile = await this._repository.getUserDatingProfile(userId);
            return profile;
        } catch (error) {
            console.error("Error fetching user dating profile:", error);
            throw new Error("Failed to get user dating profile");
        }
    }

    async handleDatingTab1(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any> {
        try {
            const user = await this._repository.findUserById(userId);
            if (user) {
                return await this._repository.updateProfile(userId, formData);
            } else {
                return await this._repository.createProfile(userId, formData);
            }
        } catch (error) {
            console.error("Error handling dating tab 1:", error);
            throw new Error("Failed to handle dating tab 1");
        }
    }

    async getProfileImages(userId: string): Promise<string[] | null> {
        try {
            const user = await this._repository.findUserById(userId);
            return user ? user.images : null;
        } catch (error) {
            console.error("Error fetching profile images:", error);
            throw new Error("Failed to get profile images");
        }
    }

    async updateUserPreferences(userId: string, maximumAge: number, interestedGender: string): Promise<any> {
        try {
            console.log("Interested Gender:", interestedGender);
            const user = await this._repository.findUserById(userId);
            if (!user) {
                throw new Error("User not found");
            }

            user.maximumAge = maximumAge;
            user.interestedGender = interestedGender;
            await this._repository.saveUser(user);

            return user;
        } catch (error) {
            console.error("Error updating user preferences:", error);
            throw new Error("Failed to update user preferences");
        }
    }

    async getUserSettings(userId: string): Promise<any> {
        try {
            const user = await this._repository.findUserById(userId);
            console.log(user);
            if (!user) {
                return null;
            }

            // Define default values if necessary
            return {
                maximumAge: user.maximumAge || 18,
                profileVisibility: user.profileVisibility || false,
                gender: user.interestedGender || 'not specified'
            };
        } catch (error) {
            console.error("Error fetching user settings:", error);
            throw new Error("Failed to get user settings");
        }
    }

    async getDatingTab1Details(userId: string): Promise<any> {
        try {
            const user = await this._repository.findUserById(userId);
            if (!user) {
                return null;
            }

            // Extract form data from the user profile
            return {
                name: user.name,
                age: user.age,
                bio: user.bio,
                gender: user.gender
            };
        } catch (error) {
            console.error("Error fetching dating tab 1 details:", error);
            throw new Error("Failed to get dating tab 1 details");
        }
    }
    async adminDeleteRecord(id: string): Promise<any> {
        try {
            await this._repository.findReportById(id)
        } catch (error) {
            console.error("Error fetching adminDeleteRecord:", error);
            throw new Error("Failed to get adminDeleteRecord");
        }
    }
    async deleteComment(commentId: string): Promise<void> {
        try {
            await this._repository.deleteComment(commentId)
        } catch (error) {
            console.error("Error fetching deleteComment:", error);
            throw new Error("Failed to get deleteComment");
        }
    }
    async deletePost(postId: string): Promise<void> {
        try {
            await this._repository.deletePost(postId)
        } catch (error) {
            console.error("Error fetching deletePost:", error);
            throw new Error("Failed to get deletePost");
        }
    }
    async fetchPostComment(postId: string): Promise<any> {
        try {
            console.log(postId);

            const formattedComments = await this._repository.fetchPostComment(postId)
            return formattedComments
        } catch (error) {
            console.error("Error fetching fetchPostComment:", error);
            throw new Error("Failed to get fetchPostComment");
        }
    }

    async executed(content: string, userId: string, postId: string): Promise<any> {
        try {
            if (!content || !userId || !postId) {
                throw new Error("Content, userId, and postId are required");
            }

            const user = await this._repository.findUser(userId);
            if (!user) {
                throw new Error("User not found");
            }

            const postDetails = await this._repository.findPostById(postId);
            if (!postDetails) {
                throw new Error("Post not found");
            }

            const newComment = await this._repository.saveComment({
                userId,
                postId,
                content,
                replies: []
            });

            const message = `${user.username} commented: ${content}`;
            await this._repository.createNotification({
                user: postDetails.userId,
                interactorId: userId,
                type: 'comment',
                message: message
            });

            const repliesWithUserData = await this._repository.getRepliesWithUserData(newComment._id);

            const formattedReplies = repliesWithUserData.map((reply: any) => ({
                _id: reply.replies._id,
                content: reply.replies.content,
                createdAt: reply.replies.createdAt,
                avatar: reply.replies.author.profilePicture,
                author: reply.replies.author.username
            }));

            return {
                _id: newComment._id,
                content: newComment.content,
                avatar: user.profilePicture,
                author: user.username,
                replies: formattedReplies
            };
        } catch (error) {
            console.error("Error fetching executed:", error);
            throw new Error("Failed to get executed");
        }
    }
    async deleteCommentReply(parentCommentId: string, comment: string) {
        try {
            const result = await this._repository.deleteCommentReply(parentCommentId, comment)
            return result
        } catch (error) {
            console.error("Error fetching deleteCommentReply:", error);
            throw new Error("Failed to get deleteCommentReply");
        }
    }
    async likedUserDetails(likedUsersId: any): Promise<any> {
        try {
            const LikedUsers = await this._repository.likedUserDetails(likedUsersId)
            return LikedUsers
        } catch (error) {
            console.error("Error fetching likedUserDetails:", error);
            throw new Error("Failed to get likedUserDetails");
        }
    }
    async postAlreadyReported(postId: any, victimUser: any): Promise<any> {
        try {
            const existingReport = await this._repository.postAlreadyReported(postId, victimUser)
            return existingReport
        } catch (error) {
            console.error("Error fetching postAlreadyReported:", error);
            throw new Error("Failed to get postAlreadyReported");
        }
    }
    async userPostedReply(content: any, userId: any, postId: any, parentId: any): Promise<any> {
        try {
            const formattedReply = await this._repository.userPostedReply(content, userId, postId, parentId)
            return formattedReply
        } catch (error) {
            console.error("Error fetching userPostedReply:", error);
            throw new Error("Failed to get userPostedReply");
        }
    }

    async profileCompletionStatus(userId: string): Promise<ProfileCompletionStatus> {
        try {
            const { profile, isProfileComplete } = await this._repository.profileCompletionStatus(userId)
            return { profile, isProfileComplete }
        } catch (error) {
            console.error("Error fetching profileCompletionStatus:", error);
            throw new Error("Failed to get profileCompletionStatus");
        }
    }



}
