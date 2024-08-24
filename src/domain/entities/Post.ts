// entities/Post.ts

export interface Post {
  _id?: string; // MongoDB ObjectId
  imageUrl: string[];
  caption: string;
  userId: string;
  likes?: string[];
  likeCount?: number;
  createdAt?: Date;
  isReported?: string[]
  isActive?: boolean
}
