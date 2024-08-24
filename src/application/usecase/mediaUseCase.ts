import mongoose, { ObjectId } from "mongoose";
import { Post } from "../../domain/entities/Post";
import { User } from "../../domain/entities/User";
import { Comment } from "../../domain/entities/Comment";

import { IMediaRepository } from "../interface/IMediaRepository";
import { IMediaUseCase } from "../interface/IMediaUseCase";

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
    async reportPost(postId: string, victimUser: string): Promise<boolean> {
        console.log("reportpost");
        
        const action = await this.repository.reportPost(postId, victimUser)
        console.log("returned");
        
        return action
    }
    async uploadStory(url: string, userId: string): Promise<boolean> {
        const action = await this.repository.uploadStory(url,userId)
        return true
    }

    async updateProfile(name: string, bio: string, email: string): Promise<boolean> {
        const action = await this.repository.updateProfile(name,bio,email)
        return true
    }

    
} 
