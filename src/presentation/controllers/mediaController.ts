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

    // async uploadImage(req: Request, res: Response, next: NextFunction) {
    //     try {
    //         const { file } = req;
    //         const { caption, email } = req.body;

    //         if (!file || !('location' in file)) {
    //             return res.status(400).send('Invalid file format or no file uploaded');
    //         }

    //         const imageUrl = file.location as string;

    //         // Optionally, validate caption and email
    //         if (!caption || !email) {
    //             return res.status(400).json({ error: 'Caption and email are required' });
    //         }

    //         console.log(email);

    //         const result = await this.mediaUseCase.createPost(imageUrl, caption, email);

    //         res.json({ result });
    //     } catch (error) {
    //         console.error(error);
    //         res.status(500).json({ error: 'Internal Server Error' });
    //     }
    // }

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
            console.log(followThatUser);

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
            
            const { postedComment,userOfPost, postId } = req.body;
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
    async reportPost(req: Request, res: Response, next: NextFunction) {
        try {
            const{postId,victimUser}= req.body
            console.log(req.body);
            
            const result = await this.mediaUseCase.reportPost(postId,victimUser)
            res.json({success:true})

        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async uploadStory(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body);
            
            const usecase = await this.mediaUseCase.uploadStory(req.body.url,req.body.userId)
            res.json({usecase})
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    async updateProfile(req: Request, res: Response, next: NextFunction) {
        try {
            console.log(req.body);
            
            const usecase = await this.mediaUseCase.updateProfile(req.body.name,req.body.bio,req.body.email)
            res.json({usecase})
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
    






}
