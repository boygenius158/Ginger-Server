import scheduleCronJobs from "./cronScheduler";
import deletePremiumDoc from "./tasks/cleanupExpiredDocuments";

const cron = require('node-cron');

function scheduleDelete() {
    cron.schedule('0 0 * * *', deletePremiumDoc)
    console.log('running premium expired cleaner')


}

export default scheduleDelete