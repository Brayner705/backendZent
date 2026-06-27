import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import incomeRoutes from './routes/incomeRoutes.js';
import loginRoutes from './routes/loginRoutes.js';
import registerRouter from './routes/registerRoutes.js';
import historyRoutes from './routes/historyRoutes.js';
import spentRoutes from './routes/spentRoutes.js';
import debtsRoutes from './routes/debtsRoutes.js';
import loandRouter from './routes/loandRoutes.js'; './routes/loandRoutes.js'
import goalRouter from './routes/goalRouter.js'
// import {resetMonthValues} from './jobs/resetMonth.js';
import { updateInterest } from './jobs/updateInterestDebt.js';
import router from './routes/loandRoutes.js';

const PORT = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// resetMonthValues.start()
// updateInterest.start() // Iniciar el cron job para actualizar intereses

app.use('/auth', registerRouter);
app.use('/auth', loginRoutes);
app.use('/income', incomeRoutes);
app.use('/spent', spentRoutes);
app.use('/history', historyRoutes);
app.use('/debts', debtsRoutes);
app.use('/loand', loandRouter)
app.use('/goal', goalRouter)

app.listen(PORT);

export default app

console.log(`Server is running on port ${PORT}`);
