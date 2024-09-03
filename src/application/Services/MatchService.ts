import { Types } from 'mongoose';
import DatingProfile from '../../infrastructure/database/model/DatingProfileMode';

class MatchService {
    // Check if there is a mutual match between two users
    async checkMatch(userId1: Types.ObjectId, userId2: Types.ObjectId): Promise<boolean> {
        // Find both users
        const user1 = await DatingProfile.findOne({ userId: userId1 }).populate('likedUsers').exec();
        const user2 = await DatingProfile.findOne({ userId: userId2 }).populate('likedUsers').exec();

        // If either user is not found, return false
        if (!user1 || !user2) {
            return false;
        }

        // Check if user1 has liked user2 and if user2 has liked user1
        const user1LikesUser2 = user1.likedUsers.some(like => like._id.equals(userId2));
        const user2LikesUser1 = user2.likedUsers.some(like => like._id.equals(userId1));

        return user1LikesUser2 && user2LikesUser1;
    }

    // Handle the swipe action
    async handleSwipe(userId: Types.ObjectId, targetUserId: Types.ObjectId): Promise<boolean> {
        // Find the user who is swiping
        console.log(userId, "[][][");

        const user = await DatingProfile.findOne({ userId }).exec();
        const user2 = await DatingProfile.findOne({ userId: targetUserId }).exec();

        // If user is not found, throw an error
        if (!user) {
            throw new Error('User not found');
        }

        // Add targetUserId to likedUsers if not already present
        if (!user.likedUsers.includes(targetUserId)) {
            user.likedUsers.push(targetUserId);
            await user.save();

            if (!user2?.likedByUsers.includes(userId)) {
                user2?.likedByUsers.push(userId)
                await user2?.save()
            }
        }

        // Check if the swipe results in a match
        return this.checkMatch(userId, targetUserId);
    }
}

export default new MatchService();
