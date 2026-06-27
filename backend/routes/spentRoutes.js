import expres from 'express';
import { Spent } from '../models/spent.js';
import { History } from '../models/history.js';
import { User } from '../models/user.js';
import { getWeekOfMonth } from 'date-fns';
import cron from 'node-cron';
const router = expres.Router();

// Add history of spent for an user and update the total spent for the current month 
router.post('/:user_id', async (req, res) => {
  try {
    // Extract user_id from the request parameters and nameSpent, amountSpent from the request body
    const { user_id } = req.params;
    const { nameSpent, amountSpent } = req.body;

    const user = await User.findById(user_id);
    if (!user) return res.status(404).send({ error: 'User not found' });

    if (!nameSpent || !amountSpent)
      return res.status(400).send({ error: 'Los campos son requeridos' });

    user.totalMoney -= amountSpent;
    user.totalSpent += amountSpent;
    await user.save();

    // Update the Spent document by adding the amountSpent to the corresponding week and calculating the total spent
    let spent = await Spent.findOne({ user_id: user_id });
    if(!spent) {
        const newSpent = new Spent({
        user_id: user_id,
        totalWeek1Spent: 0,
        totalWeek2Spent: 0,
        totalWeek3Spent: 0,
        totalWeek4Spent: 0,
        totalWeek5Spent: 0,
      });
      await newSpent.save();
    }

    const totalSpent = await saveWeekSpent(spent, amountSpent);
    
    const newHistory = new History({
      user_id: user_id,
      nameMovement: nameSpent,
      typeOperation: 'Spent',
      money: amountSpent,
    });

    await newHistory.save();

    const history = await History.find({ user_id: user_id, typeOperation: 'Spent' })
      .sort({ createdAt: -1 })
      .limit(5);

    const userWeeksSpent = await Spent.findOne({ user_id: user_id }); 

    return res.status(200).json({
      message: 'Spent history added successfully',
      status: 'true',
      history,
      week1: userWeeksSpent.totalWeek1Spent,
      week2: userWeeksSpent.totalWeek2Spent,
      week3: userWeeksSpent.totalWeek3Spent,
      week4: userWeeksSpent.totalWeek4Spent,
      week5: userWeeksSpent.totalWeek5Spent,
      totalSpent: totalSpent,
    });

  } catch (error) {
    console.error('Error fetching spent:', error);
    return res.status(500).send({ error: 'Error fetching spent' });
  }
});

// Get total spent for a user
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const spent = await Spent.findOne({ user_id: user_id });
    const user = await User.findById(user_id);
    if (!spent) return res.status(404).send({ error: 'User not found' });

    const totalMoney = user.totalMoney;

    const totalSpent =
      spent.totalWeek1Spent +
      spent.totalWeek2Spent +
      spent.totalWeek3Spent +
      spent.totalWeek4Spent +
      spent.totalWeek5Spent;

    
    const history = await History.find({ user_id: user_id, typeOperation: 'Spent' })
      .sort({ createdAt: -1 })
      .limit(5);

    if (history.length === 0) {
      spent.totalWeek1Spent = 0;
      spent.totalWeek2Spent = 0;
      spent.totalWeek3Spent = 0;
      spent.totalWeek4Spent = 0;
      spent.totalWeek5Spent = 0;
      spent.totalMoneySpent = 0;
      await spent.save();

      return res.status(200).json({
        message: 'No history found for this user',
        status: 'false',
        history,
        week1: spent.totalWeek1Spent,
        week2: spent.totalWeek2Spent,
        week3: spent.totalWeek3Spent,
        week4: spent.totalWeek4Spent,
        week5: spent.totalWeek5Spent,
        totalSpent: 0,
      });
    }

    return res.status(200).json({
      message: 'Spent fetched successfully',
      status: 'true',
      totalSpent: totalSpent,
      history: history,
      week1: spent.totalWeek1Spent,
      week2: spent.totalWeek2Spent,
      week3: spent.totalWeek3Spent,
      week4: spent.totalWeek4Spent,
      week5: spent.totalWeek5Spent,
    });
  } catch (error) {
    console.error('Error fetching spent:', error);
    return res.status(500).send({ error: 'Error fetching spent' });
  }
});

// functions
const saveWeekSpent = async (userSpent, money) => {
  // Calculando el total de la semana actual
  const currentDate = new Date();

  switch (getWeekOfMonth(currentDate)) {
    case 1:
      userSpent.totalWeek1Spent += money;
      await userSpent.save();
      break;
    case 2:
      userSpent.totalWeek2Spent += money;
      await userSpent.save();
      break;
    case 3:
      userSpent.totalWeek3Spent += money;
      await userSpent.save();
      break;
    case 4:
      userSpent.totalWeek4Spent += money;
      await userSpent.save();
      break;
    default:
      userSpent.totalWeek5Spent += money;
      await userSpent.save();
      break;
  }

  const totalSpent =
    userSpent.totalWeek1Spent +
    userSpent.totalWeek2Spent +
    userSpent.totalWeek3Spent +
    userSpent.totalWeek4Spent +
    userSpent.totalWeek5Spent;

  return totalSpent;
};

export default router;
