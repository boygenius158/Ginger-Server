import { Request, Response, NextFunction } from 'express';
import { IMediaUseCase } from "../../application/interface/IMediaUseCase";
import mongoose from 'mongoose';
import { HttpStatus } from '../../utils/HttpStatus';
interface MulterFile extends Express.Multer.File {
    location?: string; // This property will be added by your file upload middleware
}
export class MediaController {
    private _mediaUseCase: IMediaUseCase;

    constructor(mediaUseCase: IMediaUseCase) {
        this._mediaUseCase = mediaUseCase;
    }


    async getExpiryDate(req: Request, res: Response) {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ message: 'User ID is required' });
            }

            const daysLeft = await this._mediaUseCase.getExpiryDate(userId);
            res.status(HttpStatus.OK).json({ daysLeft });
        } catch (error) {
            console.error('Error occurred while fetching expiry date:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: error });
        }
    }
    async uploadImage(req: Request, res: Response, next: NextFunction) {
        // console.log("reached");

        try {
            const files = req.files as MulterFile[]

            const { caption, email } = req.body;

            if (!files || files.length === 0) {
                return res.status(HttpStatus.BAD_REQUEST).send('No files uploaded');
            }

            const imageUrl: string[] = files.map(file => {
                if (!file.location) {
                    throw new Error("File location is missing");
                }
                return file.location;
            });

            // console.log(imageUrl);



            // Optionally, validate caption and email
            if (!caption || !email) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Caption and email are required' });
            }

            // console.log(email);

            const result = await this._mediaUseCase.createPost(imageUrl, caption, email);

            res.json({ result });
            return
        } catch (error) {
            console.error(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async visitProfile(req: Request, res: Response, next: NextFunction) {
        try {
            // console.log("uiuiuiui");

            const username = req.body.username
            if (!username) {
                throw new Error
            }
            const user = await this._mediaUseCase.findUserIdByUsername(username)
            // console.log(user._id,"pooo");

            const post = await this._mediaUseCase.findUserPost(user._id)
            // console.log(post);


            res.json({ user, post })


        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async followProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { followUser, orginalUser } = req.body
            console.log(followUser, orginalUser, "i909");

            const followUserId = await this._mediaUseCase.findUserId(followUser)
            console.log(followUserId);

            if (!followUserId) {
                return
            }
            const followThatUser = await this._mediaUseCase.followProfile(orginalUser, followUserId)

            // const user = await this._mediaUseCase.followProfile()
            // console.log(followThatUser);

            res.json({ followThatUser })
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async checkFollowingStatus(req: Request, res: Response, next: NextFunction) {
        try {
            console.log("checkFollowingStatus", req.body);

            const { followUser, orginalUser } = req.body
            const followUserId = await this._mediaUseCase.findUserId(followUser)
            if (!followUserId) {
                return
            }
            const followThatUser = await this._mediaUseCase.checkFollowingStatus(orginalUser, followUserId)

            // const user = await this._mediaUseCase.followProfile()

            res.json({ followThatUser })
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async fetchFeed(req: Request, res: Response, next: NextFunction) {
        try {
            // console.log(req.body,"helo9");
            const { email, offset, limit } = req.body

            const feed = await this._mediaUseCase.fetchFeed(email, offset, limit)
            res.json({ feed })
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async likePost(req: Request, res: Response, next: NextFunction) {
        try {
            // console.log(req.body);
            const { postId, originalUser } = req.body
            console.log(originalUser, "original user");

            const result = await this._mediaUseCase.likePostAction(postId, originalUser)
            res.json({ result })
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }

    async postComment(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body);

            const { postedComment, userOfPost, postId } = req.body;
            console.log(postId);

            const comment = await this._mediaUseCase.postComment(userOfPost, postedComment, postId);
            // console.log(comment);

            // res.status(HttpStatus.OK).json(comment);
            res.json({ comment: comment });

        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }

    async uploadStory(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body);

            const usecase = await this._mediaUseCase.uploadStory(req.body.url, req.body.userId)
            res.json({ usecase })
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body);

            const usecase = await this._mediaUseCase.updateProfile(req.body.name, req.body.bio, req.body.email)
            res.json({ usecase })
        } catch (error) {
            console.log(error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal Server Error' });
        }
    }
    async reportPost(req: Request, res: Response): Promise<void> {
        try {
            const { victimUser, postId } = req.body;
            await this._mediaUseCase.reportPost(victimUser, postId);
            res.status(HttpStatus.OK).json({ message: "Post reported successfully" });
        } catch (error) {
            console.error("Error reporting post:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred while reporting the post" });
        }
    }
    async fetchSavedPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const { username } = req.body;
            const result = await this._mediaUseCase.fetchSavedPosts(username);
            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            console.error('Error fetching saved posts:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }


    }
    async updateReadStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { sender, recipient } = req.body;
            const result = await this._mediaUseCase.updateReadStatus(sender, recipient);
            res.status(HttpStatus.OK).json(result);
        } catch (error) {
            console.error('Error updating read status:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }
    }
    async fetchHistoricalData(req: Request, res: Response, next: NextFunction) {
        try {
            const { senderId, receiverId } = req.body;
            const messages = await this._mediaUseCase.fetchHistoricalData(senderId, receiverId);
            res.status(HttpStatus.OK).json({ messages });
        } catch (error) {
            console.error('Error fetching historical data:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }
    }
    async getPremiumStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            const role = await this._mediaUseCase.getPremiumStatus(userId);
            if (!role) {
                return res.status(HttpStatus.NOT_FOUND).json({ error: 'User not found' });
            }

            res.status(HttpStatus.OK).json({ role });
        } catch (error) {
            console.error('Error fetching premium status:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }
    }
    async getChatList(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }

            const chatList = await this._mediaUseCase.getChatList(userId);
            res.status(HttpStatus.OK).json(chatList);
        } catch (error) {
            console.error('Error fetching chat list:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    }
    async visitPost(req: Request, res: Response, next: NextFunction) {
        try {
            const { postId } = req.body;
            if (!postId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: 'Post ID is required' });
            }

            const postDetails = await this._mediaUseCase.visitPost(postId);
            res.status(HttpStatus.OK).json(postDetails);
        } catch (error) {
            console.error('Error visiting post:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    }
    async fetchStories(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(HttpStatus.BAD_REQUEST).json({ error: 'User ID is required' });
            }

            const stories = await this._mediaUseCase.fetchStories(userId);
            res.status(HttpStatus.OK).json({ stories });
        } catch (error) {
            console.error('Error fetching stories:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Internal server error' });
        }
    }
    async handleAudioUpload(req: Request, res: Response): Promise<void> {
        try {
            const { sender, receiverId, audio_url } = req.body;
            await this._mediaUseCase.processAudioUpload(sender, receiverId, audio_url.url);
            res.json({ success: true });
        } catch (error) {
            console.error('Error uploading audio:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }
    }
    async handleFetchNotifications(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            console.log("fetch notifications", req.body);

            const notifications = await this._mediaUseCase.execute(userId);
            console.log(notifications, "notifications");

            res.json({ notifications });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ error: 'Server error' });
        }
    }
    async handleSavePost(req: Request, res: Response): Promise<void> {
        try {
            const { userId, postId } = req.body;

            const result = await this._mediaUseCase.executeSavePost(userId, postId);
            res.json(result);
        } catch (error) {
            console.error('Error saving post:', error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "An error occurred" });
        }
    }
    async getUserDemographics(req: Request, res: Response): Promise<void> {

        try {
            console.log("90");

            const demographics = await this._mediaUseCase.getUserDemographics();
            res.status(HttpStatus.OK).json(demographics);
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: "Error fetching demographics data", error });
        }
    }

    async getChartData(req: Request, res: Response): Promise<void> {
        try {
            const { chartData, chartConfig } = await this._mediaUseCase.getChartData();
            res.status(HttpStatus.OK).json({ success: true, chartData, chartConfig });
        } catch (error) {
            console.error("Error occurred:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
        }
    }

    async userPostedReply(req: Request, res: Response): Promise<void> {
        try {
            const { chartData, chartConfig } = await this._mediaUseCase.getChartData();
            res.status(HttpStatus.OK).json({ success: true, chartData, chartConfig });
        } catch (error) {
            console.error("Error occurred:", error);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ success: false, message: "Internal Server Error" });
        }
    }

    

}
