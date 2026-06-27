import cron from 'node-cron';
import {User} from '../models/user.js';

// Reset monthly income at the start of the month
export const resetMonthValues = cron.schedule('0 0 1 * *', async()=> {
        try {
            await User.updateMany({}, { $set: {
                totalWeek1: 0,
                totalWeek2: 0,
                totalWeek3: 0,
                totalWeek4: 0,
                totalWeek5: 0
            }})

            // Enviar al Frontend que se han reseteado los valores del mes
            console.log("Month values reset successfully for all users.");
            
        }catch (error) {
            console.log("Hubo un error: ", error)
        }
})