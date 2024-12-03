import { ProfileCompletionStatus } from "./IDatingRepository";


export interface IDatingUseCase {
    swipeProfiles(userId: string): Promise<any>;
    updateProfileImages(userId: string, url: string[]): Promise<any>;
    fetchMatches(userId: string): Promise<any>;
    getUserDatingProfile(userId: string): Promise<any>;
    handleDatingTab1(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
    getProfileImages(userId: string): Promise<string[] | null>;
    updateUserPreferences(userId: string, maximumAge: number,  interestedGender: string): Promise<any>;
    getUserSettings(userId: string): Promise<any>;
    getDatingTab1Details(userId: string): Promise<any>;
    adminDeleteRecord(id: string): Promise<void>
    deleteComment(commentId: string): Promise<void>
    deletePost(postId: string): Promise<void>
    fetchPostComment(postId: string): Promise<any>
    executed(content: string, userId: string, postId: string): Promise<any>;
    deleteCommentReply(parentCommentId: string, comment: any): Promise<any>
    likedUserDetails(likedUsersId: any): Promise<any>
    postAlreadyReported(postId: any, victimUser: any): Promise<any>
    userPostedReply(content:any, userId:any, postId:any, parentId:any): Promise<any>
    profileCompletionStatus(userId: string): Promise<ProfileCompletionStatus>


    getCommentById(commentId:string):Promise<any>
    fetchPostDetails(postId:string):Promise<any>
    profileVisibility(userId:string,profileVisibility:boolean):Promise<any>
}
