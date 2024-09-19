import { PremiumModel } from "../../database/model/PremiumModel";
import UserModel from "../../database/model/UserModel";

async function deletePremiumDoc() {
    console.log("delete premium/task");

    try {
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

        // Find and delete documents older than one year
        const oldPremiumDocs = await PremiumModel.find({ createdAt: { $lt: oneYearAgo } });
        const result = await PremiumModel.deleteMany({ createdAt: { $lt: oneYearAgo } });

        console.log(`Deleted ${result.deletedCount} old Premium documents.`);

        // Extract user IDs from deleted Premium documents
        const userIds = oldPremiumDocs.map(doc => doc.userId);

        if (userIds.length > 0) {
            // Update the s of users associated with deleted Premium documents
            const updateResult = await UserModel.updateMany(
                { _id: { $in: userIds } },
                { $set: { roles: 'user' } } // Set the s to 'user'
            );

            // console.log(`Updated s for ${updateResult.nModified} users.`);
        } else {
            console.log("No users found to update.");
        }
    } catch (error) {
        console.error('Error occurred while deleting old Premium documents or updating users:', error);
    }
}

// Export the function
export default deletePremiumDoc;
