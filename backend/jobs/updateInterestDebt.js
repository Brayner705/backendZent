import cron from 'node-cron';
import { Debts } from '../models/debts.js';

export const updateInterest = cron.schedule('0 0 * * *', async () => {
  const today = new Date();
  const currentDay = today.getDate();
  const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  console.log('Ejecutando cron');

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);

  if (currentDay == 15 || currentDay == lastDayOfMonth) {
    try {
      const debts = await Debts.updateMany(
        {
          interest: 1,
          // 2. FILTRO DE SEGURIDAD: Solo deudas que no se hayan actualizado HOY
          $or: [
            { lastInterestAppliedAt: { $lt: startOfToday } },
            { lastInterestAppliedAt: { $exists: false } },
          ],
        },
        [
          {
            $set: {
              totalDebt: {
                $add: [
                  '$totalDebt', 
                  { $multiply: ['$saveDebtTotal', { $divide: ['$percentageInterest', 100] }] },
                ],
              },
              lastInterestAppliedAt: new Date()
            },
          },
        ],
        { updatePipeline: true },
      );

      console.log(
        `Comisiones aplicadas con éxito (Día ${currentDay}). Deudas actualizadas: ${debts.modifiedCount}`,
      );
    } catch (error) {
      console.error('Error actualizando comisiones en el cron job:', error);
    }
  }
});
