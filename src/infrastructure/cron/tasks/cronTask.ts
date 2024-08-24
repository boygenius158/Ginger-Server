import StoryModel from "../../database/model/StoryModel";
import mongoose from 'mongoose';

async function deleteExpireStoriesTask() {
    console.log("Running story cleaner");

    try {
        const now = new Date();
        const cutoff = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const result = await StoryModel.deleteMany({
            createdAt: { $lt: cutoff }
        });

        console.log(`${result.deletedCount} stories deleted.`);

    } catch (error) {
        console.error("Error while deleting expired stories:", error);
    }
}

export default deleteExpireStoriesTask;
