import express from 'express';
import { User } from '../models/user.js';
import { History } from '../models/history.js';
import { getWeekOfMonth } from 'date-fns';

const router = express.Router();

// Task Tomorrow: Reset values to 0 at the end of the month or start of the month

// Define your income-related routes here
router.put('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const { nameMovement, money } = req.body;

    // Logic to update the user's income based on the provided data
    const updateUser = await User.findById(user_id);
    console.log(nameMovement)

    if (!updateUser) return res.status(404).send({ error: 'User not found' });

    // Sumando el nuevo ingreso al totalMoney del usuario
    updateUser.totalMoney += money;

    // Actualizando el total de ingresos acumulados en la semana correspondiente y el total de ingresos acumulados
    const totalIncome = saveWeekIncome(updateUser, money);

    // Guardar el nuevo ingreso en la colección de History
    const newHistory = new History({
      user_id: user_id,
      nameMovement: nameMovement,
      typeOperation: 'Income',
      money: money,
    });

    await newHistory.save();
    await updateUser.save(); 

    const historiesIncome = await History.find({user_id, typeOperation: 'Income'}).sort({createdAt: -1}).limit(5);

    console.log(historiesIncome)

    // Respond with the updated user data or a success message
    res.status(200).json({
      message: 'Income updated successfully',
      status: 'true',
      user: {
        week1: updateUser.totalWeek1,
        week2: updateUser.totalWeek2,
        week3: updateUser.totalWeek3,
        week4: updateUser.totalWeek4,
        week5: updateUser.totalWeek5,
        totalIncome: totalIncome,
        historiesIncome
      },
    });
  } catch (error) {
    console.error('Error updating income:', error);
    return res.status(500).send({ error: 'Error updating income' });
  }
});

// get total income for a user
router.get('/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findById(user_id);

    if (!user) return res.status(404).send({ error: 'User not found' });
    const history = await History.find({ user_id, typeOperation: 'Income' }).sort({ createdAt: -1 }).limit(5);

    const totalIncome =
      user.totalWeek1 + user.totalWeek2 + user.totalWeek3 + user.totalWeek4 + user.totalWeek5;

    res.status(200).json({
      week1: user.totalWeek1,
      week2: user.totalWeek2,
      week3: user.totalWeek3,
      week4: user.totalWeek4,
      week5: user.totalWeek5,
      totalIncome: totalIncome,
      history,
      status: 'true',
    });
  } catch (error) {
    console.error('Error fetching income:', error);
    return res.status(500).send({ error: 'Error fetching income' });
  }
});

// Get total income for a user
router.get('/total/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findById(user_id);
    if (!user) return res.status(404).send({ error: 'User not found' });

    res.status(200).json({
      totalMoney: user.totalMoney,
      status: 'true',
    });
  } catch (error) {
    console.error('Error fetching total income:', error);
    return res.status(500).send({ error: 'Error fetching total income' });
  }
});

// limited history for a user
router.get('/history/user/limit/:user_id', async (req, res) => {
  try {
    const { user_id } = req.params;
    const history = await History.find({ user_id })
      .limit(5)
      .sort({ createdAt: -1 })
      .select('-__v -user_id -_id');

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching history:', error);
    return res.status(500).send({ error: 'Error fetching history' });
  }
});

//functions
const saveWeekIncome = (user, money) => {
  // Calculando el total de la semana actual
  const currentDate = new Date();

  switch (getWeekOfMonth(currentDate)) {
    case 1:
      user.totalWeek1 += money;
      break;
    case 2:
      user.totalWeek2 += money;
      break;
    case 3:
      user.totalWeek3 += money;
      break;
    case 4:
      user.totalWeek4 += money;
      break;
    default:
      user.totalWeek5 += money;
      break;
  }

  const totalIncome =
    user.totalWeek1 + user.totalWeek2 + user.totalWeek3 + user.totalWeek4 + user.totalWeek5;

  return totalIncome;
};

export default router;

console.log('Income routes loaded');


//  const time = new Date();

//     const resetWeekValues = time.getDate() == 1 ? true : false;

//     if (resetWeekValues) {
//       user.totalWeek1 = 0;
//       user.totalWeek2 = 0;
//       user.totalWeek3 = 0;
//       user.totalWeek4 = 0;
//       user.totalWeek5 = 0;
//       user.totalMoney = 0;
//       await user.save();

//       return res
//         .status(200)
//         .json({
//           message: 'No history found for this user',
//           status: 'false',
//           history,
//           week1: user.totalWeek1,
//           week2: user.totalWeek2,
//           week3: user.totalWeek3,
//           week4: user.totalWeek4,
//           week5: user.totalWeek5,
//           totalIncome: 0,
//         });
//     }