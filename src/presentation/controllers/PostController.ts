import { Request, Response, NextFunction } from 'express';
import { IMediaUseCase } from "../../application/interface/IMediaUseCase";
import mongoose from 'mongoose';
interface MulterFile extends Express.Multer.File {
    location?: string; // This property will be added by your file upload middleware
}
export class MediaController {
    private mediaUseCase: IMediaUseCase;

    constructor(mediaUseCase: IMediaUseCase) {
        this.mediaUseCase = mediaUseCase;
    }


    async getExpiryDate(req: Request, res: Response) {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({ message: 'User ID is required' });
            }

            const daysLeft = await this.mediaUseCase.getExpiryDate(userId);
            res.status(200).json({ daysLeft });
        } catch (error) {
            console.error('Error occurred while fetching expiry date:', error);
            res.status(500).json({ message: error });
        }
    }
    async uploadImage(req: Request, res: Response, next: NextFunction) {
        // console.log("reached");

        try {
            const files = req.files as MulterFile[]

            const { caption, email } = req.body;

            if (!files || files.length === 0) {
                return res.status(400).send('No files uploaded');
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
                return res.status(400).json({ error: 'Caption and email are required' });
            }

            // console.log(email);

            const result = await this.mediaUseCase.createPost(imageUrl, caption, email);

            res.json({ result });
            return
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async visitProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const username = req.body.username
            if (!username) {
                throw new Error
            }
            const user = await this.mediaUseCase.findUserIdByUsername(username)
            const post = await this.mediaUseCase.findUserPost(user._id)
            console.log(user);


            res.json({ user, post })


        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async followProfile(req: Request, res: Response, next: NextFunction) {
        try {
            const { followUser, orginalUser } = req.body
            const followUserId = await this.mediaUseCase.findUserId(followUser)
            if (!followUserId) {
                return
            }
            const followThatUser = await this.mediaUseCase.followProfile(orginalUser, followUserId)

            // const user = await this.mediaUseCase.followProfile()
            // console.log(followThatUser);

            res.json({ followThatUser })
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async checkFollowingStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { followUser, orginalUser } = req.body
            const followUserId = await this.mediaUseCase.findUserId(followUser)
            if (!followUserId) {
                return
            }
            const followThatUser = await this.mediaUseCase.checkFollowingStatus(orginalUser, followUserId)

            // const user = await this.mediaUseCase.followProfile()

            res.json({ followThatUser })
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async fetchFeed(req: Request, res: Response, next: NextFunction) {
        try {
            // console.log(req.body,"helo9");
            const { email, offset, limit } = req.body

            const feed = await this.mediaUseCase.fetchFeed(email, offset, limit)
            res.json({ feed })
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async likePost(req: Request, res: Response, next: NextFunction) {
        try {
            // console.log(req.body);
            const { postId, originalUser } = req.body
            console.log(originalUser, "original user");

            const result = await this.mediaUseCase.likePostAction(postId, originalUser)
            res.json({ result })
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async postComment(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body);

            const { postedComment, userOfPost, postId } = req.body;
            console.log(postId);

            const comment = await this.mediaUseCase.postComment(userOfPost, postedComment, postId);
            // console.log(comment);

            // res.status(200).json(comment);
            res.json({ comment: comment });

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    async uploadStory(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body);

            const usecase = await this.mediaUseCase.uploadStory(req.body.url, req.body.userId)
            res.json({ usecase })
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body);

            const usecase = await this.mediaUseCase.updateProfile(req.body.name, req.body.bio, req.body.email)
            res.json({ usecase })
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async reportPost(req: Request, res: Response): Promise<void> {
        try {
            const { victimUser, postId } = req.body;
            await this.mediaUseCase.reportPost(victimUser, postId);
            res.status(200).json({ message: "Post reported successfully" });
        } catch (error) {
            console.error("Error reporting post:", error);
            res.status(500).json({ message: "An error occurred while reporting the post" });
        }
    }
    async fetchSavedPosts(req: Request, res: Response, next: NextFunction) {
        try {
            const { username } = req.body;
            const result = await this.mediaUseCase.fetchSavedPosts(username);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error fetching saved posts:', error);
            res.status(500).json({ error: 'Server error' });
        }


    }
    async updateReadStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { sender, recipient } = req.body;
            const result = await this.mediaUseCase.updateReadStatus(sender, recipient);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error updating read status:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    async fetchHistoricalData(req: Request, res: Response, next: NextFunction) {
        try {
            const { senderId, receiverId } = req.body;
            const messages = await this.mediaUseCase.fetchHistoricalData(senderId, receiverId);
            res.status(200).json({ messages });
        } catch (error) {
            console.error('Error fetching historical data:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    async getPremiumStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            const role = await this.mediaUseCase.getPremiumStatus(userId);
            if (!role) {
                return res.status(404).json({ error: 'User not found' });
            }

            res.status(200).json({ role });
        } catch (error) {
            console.error('Error fetching premium status:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    async getChatList(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const chatList = await this.mediaUseCase.getChatList(userId);
            res.status(200).json(chatList);
        } catch (error) {
            console.error('Error fetching chat list:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async visitPost(req: Request, res: Response, next: NextFunction) {
        try {
            const { postId } = req.body;
            if (!postId) {
                return res.status(400).json({ error: 'Post ID is required' });
            }

            const postDetails = await this.mediaUseCase.visitPost(postId);
            res.status(200).json(postDetails);
        } catch (error) {
            console.error('Error visiting post:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async fetchStories(req: Request, res: Response, next: NextFunction) {
        try {
            const { userId } = req.body;
            if (!userId) {
                return res.status(400).json({ error: 'User ID is required' });
            }

            const stories = await this.mediaUseCase.fetchStories(userId);
            res.status(200).json({ stories });
        } catch (error) {
            console.error('Error fetching stories:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async handleAudioUpload(req: Request, res: Response): Promise<void> {
        try {
            const { sender, receiverId, audio_url } = req.body;
            await this.mediaUseCase.processAudioUpload(sender, receiverId, audio_url.url);
            res.json({ success: true });
        } catch (error) {
            console.error('Error uploading audio:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    async handleFetchNotifications(req: Request, res: Response): Promise<void> {
        try {
            const { userId } = req.body;
            console.log("fetch notifications", req.body);

            const notifications = await this.mediaUseCase.execute(userId);
            console.log(notifications, "notifications");

            res.json({ notifications });
        } catch (error) {
            console.error('Error fetching notifications:', error);
            res.status(500).json({ error: 'Server error' });
        }
    }
    async handleSavePost(req: Request, res: Response): Promise<void> {
        try {
            const { userId, postId } = req.body;

            const result = await this.mediaUseCase.executeSavePost(userId, postId);
            res.json(result);
        } catch (error) {
            console.error('Error saving post:', error);
            res.status(500).json({ message: "An error occurred" });
        }
    }
    async getUserDemographics(req: Request, res: Response): Promise<void> {

        try {
            console.log("90");

            const demographics = await this.mediaUseCase.getUserDemographics();
            res.status(200).json(demographics);
        } catch (error) {
            res.status(500).json({ message: "Error fetching demographics data", error });
        }
    }

    async getChartData(req: Request, res: Response): Promise<void> {
        try {
            const { chartData, chartConfig } = await this.mediaUseCase.getChartData();
            res.status(200).json({ success: true, chartData, chartConfig });
        } catch (error) {
            console.error("Error occurred:", error);
            res.status(500).json({ success: false, message: "Internal Server Error" });
        }
    }
}
