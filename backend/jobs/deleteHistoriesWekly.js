import cron from 'node-cron';
import { History } from '../models/history.js';
import { User } from '../models/user.js';
import { reporteHistoriesDeleted } from '../generadorPDF/reporteHistoriesDeleted.js';

// Delete histories older than 7 days every week

export const deleteOldHistories = cron.schedule('0 0 * * 1', async () => {
    try {
        // Crear reporte pdf del historial antes de eliminarlo
        const userIds = await User.find({}).select('_id').select('username').lean();

        for (const user of userIds) {
            const userHistories = await History.find({ user_id: user._id });

            if(userHistories.length <= 0) continue;

            await reporteHistoriesDeleted(userHistories, user.username);
            
        }
        // Delete all histories of the users
        await History.deleteMany({})
    }catch (error){
        console.log("Hubo un error: ", error)
    }
})