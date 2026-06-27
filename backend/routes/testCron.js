import cron from 'node-cron';

console.log('Cron job initialized');

cron.schedule('*0 0 1 * *', ()=> {
    console.log('Running a task every 2 minutes');
}, {
    scheduled: true,
    timezone: "America/Caracas"
})