export interface IAdminRepository {
    getPremiumPaymentDetails(): Promise<any[]>;
    getUserDetailsByRoles(roles: string[]): Promise<any[]>;
    findByIdAndUpdate(userId: string, update: any): Promise<any>;
    calculateTotalRevenue(startDate: Date, endDate: Date): Promise<number>;
    findBlockedUsers(): Promise<any[]>;
    findReportsByActionTaken(actionTaken: boolean): Promise<any[]>;
    findPostById(postId: string): Promise<any>;
    banPost(postId:string):Promise<any>
}