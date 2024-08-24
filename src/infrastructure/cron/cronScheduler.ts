import deleteExpireStoriesTask from "./tasks/cronTask";
const cron = require('node-cron');

function scheduleCronJobs() {
    // Schedule task to run every 24 hours at midnight
    cron.schedule('0 0 * * *', deleteExpireStoriesTask);

    console.log('Cron jobs scheduled successfully.');
}

// Export the function
export default scheduleCronJobs;
