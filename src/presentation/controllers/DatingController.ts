import { Request, Response, NextFunction } from "express";
// import { IDatingUseCase } from "../../application/usecase/DatingUseCase";

import { HttpStatus } from "../../utils/HttpStatus";
import CommentModel from "../../infrastructure/database/model/CommentModel";
import mongoose from "mongoose";
import { IDatingUseCase } from "../../application/interface/IDatingUseCase";
import { ProfileCompletionStatus } from "../../application/interface/IDatingRepository";
import { CustomRequest } from "../../application/interface/CustomRequest";

export class DatingController {
    private _datingUseCase: IDatingUseCase;

    constructor(_datingUseCase: IDatingUseCase) {
        this._datingUseCase = _datingUseCase;
    }

    async swipeProfile(req: CustomRequest, res: Response, next: NextFunction) {
        // console.log("swipe profile", req.body);

        try {
            if (!req.user) {
                throw new Error
            }
            const userId = req.user.id;
            console.log(userId, "777");

            const profiles = await this._datingUseCase.swipeProfiles(userId);
            if (!profiles) {
                return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching profiles" });
            }
            res.json({ profiles });
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching profiles" });
        }
    }
    async updateDatingProfileImages(req: CustomRequest, res: Response, next: NextFunction) {
        console.log("update dating profile images", req.body);

        try {
            const { url } = req.body;
            if (!req.user) {
                throw new Error
            }
            const userId = req.user.id
            await this._datingUseCase.updateProfileImages(userId, url);
            res.json({});
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while updating profile images" });
        }
    }
    async fetchMatches(req: CustomRequest, res: Response, next: NextFunction) {
        console.log("fetch matches");

        try {
            if (!req.user) {
                throw new Error
            }
            const userId = req.user.id
            const matches = await this._datingUseCase.fetchMatches(userId);
            res.json({ matches });
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching matches" });
        }
    }
    async getUserDatingProfile(req: Request, res: Response, next: NextFunction) {
        console.log("get profile", req.body);

        try {
            const { userId } = req.body;
            const user = await this._datingUseCase.getUserDatingProfile(userId);
            res.json({ user });
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while fetching the profile" });
        }
    }
    async handleDatingTab1(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const {  formData } = req.body;
            console.log(req.body);
            if (!req.user) {
                throw new Error
            }
            const userId = req.user.id
            const result = await this._datingUseCase.handleDatingTab1(userId, formData);
            res.json(result);
        } catch (error) {
            console.error("Error handling dating profile:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while processing your request." });
        }
    }
    async handleDatingTab3(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            if (!req.user) {
                throw new Error
            }
            const userId = req.user.id
            const images = await this._datingUseCase.getProfileImages(userId);

            if (!images) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
            }

            res.json({ images });
        } catch (error) {
            console.error("Error fetching user images:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while fetching user images." });
        }
    }
    async handleDatingTab4(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            if (!req.user) {
                throw new Error
            }
            const userId = req.user.id
            const { maximumAge, interestedGender } = req.body;

            const updatedUser = await this._datingUseCase.updateUserPreferences(userId, maximumAge, interestedGender);

            if (!updatedUser) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: "User not found" });
            }

            res.json(updatedUser);
        } catch (error) {
            console.error("Error updating user preferences:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while updating user preferences." });
        }
    }
    async handleUserSettings(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            
            // console.log(userId);
            if (!req.user) {
                throw new Error
            }
            const userId = req.user.id
            if (!userId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }

            const userSettings = await this._datingUseCase.getUserSettings(userId);

            if (!userSettings) {
                return res.status(HttpStatus.NOT_FOUND).json({ error: 'User not found' });
            }

            res.status(HttpStatus.OK).json({ data: userSettings });
        } catch (error) {
            console.error("Error fetching user settings:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        }
    }
    async getDatingTab1Details(req: CustomRequest, res: Response, next: NextFunction) {
        try {

            if (!req.user) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "User ID is required" });

            }
            const userId = req.user.id

            const formData = await this._datingUseCase.getDatingTab1Details(userId);

            if (!formData) {
                return res.status(HttpStatus.OK).json({ formData })
                // return res.status(HttpStatus.NOT_FOUND).json({ error: "User not found" });
            }

            return res.status(HttpStatus.OK).json({ formData });
        } catch (error) {
            console.error("Error fetching dating tab 1 details:", error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal Server Error" });
        }
    }
    async adminDeleteRecord(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.body
            if (!id) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "id is required" });
            }
            await this._datingUseCase.adminDeleteRecord(id)
            return res.json({})

        } catch (error) {
            console.error('error in admin delete record')
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "internal server errro" })
        }
    }
    async deleteComment(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            console.log("delete999");

            // Check if the user is authenticated
            if (!req.user) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "User is not authenticated" });
            }

            const userId = req.user.id;
            const { commentId } = req.body;

            // Validate the commentId
            if (!commentId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "Comment ID is required" });
            }

            // Fetch the comment from the database (assuming you have a method to do this)
            const comment = await this._datingUseCase.getCommentById(commentId);

            // Check if the comment exists
            if (!comment) {
                return res.status(HttpStatus.NOT_FOUND).json({ error: "Comment not found" });
            }

            // Check if the current user is the owner of the comment
            console.log(comment.userId, userId, "condition");

            if (comment.userId.toString() !== userId) {
                return res.status(HttpStatus.FORBIDDEN).json({ error: "You can only delete your own comments" });
            }

            // Proceed with deleting the comment if the user is the owner
            await this._datingUseCase.deleteComment(commentId);

            // Respond with success
            res.status(HttpStatus.OK).json({ success: true });
        } catch (error) {
            console.error('Error in admin delete record:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }

    async deletePost(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { postId } = req.body
            if (!postId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "id is required" });
            }
            const post = await this._datingUseCase.fetchPostDetails(postId)
            if (!req.user) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "id is required" });

            }
            if (req.user.id !== post.userId.toString()) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "id is required" });

            }
            await this._datingUseCase.deletePost(postId)
            res.status(HttpStatus.OK).json({ success: true })

        } catch (error) {
            console.error('error in admin delete record')
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "internal server errro" })
        }
    }
    async fetchPostComment(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            console.log(req.body);

            const { postId } = req.body;
            if (!postId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "id2 is required" });
            }

            // Validate the postId format before proceeding
            if (!mongoose.Types.ObjectId.isValid(postId)) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: "Invalid postId format" });
            }
           
            const formattedComments = await this._datingUseCase.fetchPostComment(postId);
            res.status(HttpStatus.OK).json({ comments: formattedComments });

        } catch (error) {
            console.error('Error fetching post comments:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
    async userPostedComment(req: CustomRequest, res: Response, next: NextFunction) {
        try {
            const { content, postId } = req.body;
            console.log(req.body, req.user);
            if (!req.user) {
                throw new Error
            }
            const userId = req.user.id
            const response = await this._datingUseCase.executed(content, userId, postId);
            res.status(HttpStatus.OK).json(response);
        } catch (error) {
            console.error('Error fetching post comments:', error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: "Internal server error" });
        }
    }
    async deleteCommentReply(req: CustomRequest, res: Response): Promise<any> {
        try {
            if(!req.user){
                return res.status(HttpStatus.FORBIDDEN).json({ error: "You can only delete your own comments" });
            }
            const userId = req.user.id
            const { parentCommentId, comment } = req.body;
            const deleteComment = await this._datingUseCase.getCommentById(comment);
            if (deleteComment.userId.toString() !== userId) {
                return res.status(HttpStatus.FORBIDDEN).json({ error: "You can only delete your own comments" });
            }

            const result = await this._datingUseCase.deleteCommentReply(parentCommentId, comment)
            if (result.modifiedCount === 0) {
                return res.status(HttpStatus.NOT_FOUND).json({ message: 'Comment or reply not found' });
            }

            return res.status(HttpStatus.OK).json({ message: 'Reply deleted successfully' });
        } catch (error) {
            console.error("Error occurred:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
        }
    }

    async likedUserDetails(req: Request, res: Response): Promise<any> {
        try {
            const likedUsersId = req.body.likes
            const LikedUsers = await this._datingUseCase.likedUserDetails(likedUsersId)


            // Report does not exist
            return res.json({ LikedUsers })

        } catch (error) {
            console.error("Error occurred:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
        }
    }

    async postAlreadyReported(req: CustomRequest, res: Response): Promise<any> {
        try {
            const { postId } = req.body;
            if(!req.user){
                return res.status(HttpStatus.FORBIDDEN).json({ error: "" });

            }
            const victimUser = req.user.id
            const existingReport = await this._datingUseCase.postAlreadyReported(postId, victimUser)
            if (existingReport) {
                // Report already exists
                return res.json({ alreadyReported: true });
            }

            // Report does not exist
            return res.json({ alreadyReported: false });
        } catch (error) {
            console.error("Error occurred:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
        }
    }

    async userPostedReply(req: CustomRequest, res: Response): Promise<any> {
        try {
            const { content, postId, parentId } = req.body;
            if(!req.user){
                return res.status(HttpStatus.FORBIDDEN).json({ error: "" });
            }
            const userId = req.user.id
            const formattedReply = await this._datingUseCase.userPostedReply(content, userId, postId, parentId)
            return res.json(formattedReply);

        } catch (error) {
            console.error("Error occurred:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
        }
    }



    async profileCompletionStatus(req: CustomRequest, res: Response): Promise<void> {
        try {
            if(!req.user){
                throw new Error
            }
            const userId = req.user.id
            const { profile, isProfileComplete } = await this._datingUseCase.profileCompletionStatus(userId)
            console.log("success", profile, isProfileComplete);

            res.json({
                profile,
                isProfileComplete
            })
        } catch (error) {
            console.error("Error occurred:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
        }
    }

    async profileVisibility(req:CustomRequest,res:Response):Promise<void>{
        try {
            if(!req.user){
                throw new Error
            }
            const userId = req.user.id 
            const profileVisibility = req.body.profileVisibility
            await this._datingUseCase.profileVisibility(userId,profileVisibility)
        } catch (error) {
            console.error(error,"error in profile visiblity")
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({success:false})
        }
    }



}