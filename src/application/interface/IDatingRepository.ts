export interface ProfileCompletionStatus {
    profile: any; 
    isProfileComplete: boolean;
}
export interface IDatingRepository {
    swipeProfiles(userId: string, maximumAge: number, interestedGender: string): Promise<any>;
    updateProfileImages(userId: string, url: string[]): Promise<any>;
    fetchMatches(userId: string): Promise<any>;
    getUserDatingProfile(userId: string): Promise<any>;
    findUserById(userId: string): Promise<any>;
    updateProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
    createProfile(userId: string, formData: { name: string, age: number, bio: string, gender: string }): Promise<any>;
    saveUser(user: any): Promise<any>;
    findReportById(id: string): Promise<void>
    deleteComment(commentId: string): Promise<void>
    deletePost(postId: string): Promise<void>
    fetchPostComment(postId: string): Promise<any>
    findUser(userId: string): Promise<any>;
    findPostById(postId: string): Promise<any>;
    saveComment(commentData: any): Promise<any>;
    createNotification(notificationData: any): Promise<any>;
    getRepliesWithUserData(commentId: string): Promise<any>;
    deleteCommentReply(parentCommentId: string, comment: any): Promise<any>
    likedUserDetails(likedUsersId: any): Promise<any>
    postAlreadyReported(postId: any, victimUser: any): Promise<any>
    userPostedReply(content: any, userId: any, postId: any, parentId: any): Promise<any>
    profileCompletionStatus(userId:string):Promise<ProfileCompletionStatus>


}