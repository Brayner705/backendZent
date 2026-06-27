import express from 'express';
import { Debts } from '../models/debts.js';

const router = express.Router();

// Create debt
router.post('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { nameDebts, totalDebt, interestOption, percentageInterest } = req.body;

  if (
    !nameDebts ||
    !totalDebt ||
    interestOption === undefined ||
    percentageInterest === undefined
  ) {
    return res.status(400).json({ message: 'Missing required fields', status: 'error' });
  }

  try {
    let newDebt = new Debts({});

    if (interestOption == 0) {
      // Create a new debt object
      newDebt = new Debts({
        user_id: user_id,
        nameDebts,
        totalDebt: totalDebt + totalDebt * (percentageInterest / 100),
        interest: interestOption,
        percentageInterest: 0,
        saveDebtTotal: totalDebt,
        percentagePaid: 0,
      });
    } else {
      // Create a new debt object
      newDebt = new Debts({
        user_id: user_id,
        nameDebts,
        totalDebt: totalDebt + totalDebt * (percentageInterest / 100),
        interest: interestOption,
        percentageInterest,
        saveDebtTotal: totalDebt,
        percentagePaid: 0,
      });
    }

    const {_id, ...debtData } = newDebt.toObject();

    // Save the new debt to the database
    await newDebt.save();
    const userDebts = await Debts.find({ user_id: user_id }).select('-user_id -__v -interest');

    res.status(201).json({ message: 'Debt added successfully', status: 'success', userDebts });
  } catch (error) {
    console.error('Error adding debt:', error);
    res.status(500).json({ message: 'Error adding debt', status: 'error' });
  }
});

// Update debt
router.put('/:id_user', async (req, res) => {
  const { id_user } = req.params;
  const { nameDebt, amountPaid } = req.body;

  try {
    // Find the debt by name and user_id
    const debt = await Debts.findOne({ user_id: id_user, nameDebts: nameDebt });

    if (!debt) return res.status(404).json({ message: 'Debt not found', status: 'error' });

    // Update the debt with the new paid amount
    if (debt.interest == 0) {
      debt.totalPaid += amountPaid;
      debt.totalDebt -= amountPaid;
      debt.percentagePaid = (debt.totalPaid / debt.saveDebtTotal) * 100;
    } else {
      let pagoCapital = 0
      if(amountPaid > debt.totalDebt) {
        pagoCapital = amountPaid - debt.totalDebt;
        debt.totalDebt = 0;
      }else{
        pagoCapital = 0;
        debt.totalDebt -= amountPaid;
      }

      debt.totalPaid += amountPaid;

      if(pagoCapital > 0) {
        debt.saveDebtTotal -= pagoCapital;

        if(debt.saveDebtTotal < 0) {
          debt.saveDebtTotal = 0;
        }
      }

      debt.percentagePaid = ((debt.saveDebtTotal - debt.totalDebt) / debt.saveDebtTotal) * 100;

      console.log("porcentaje por pagar: ", debt.percentagePaid);
    }

    // if (debt.totalDebt <= 0) {
    //   await Debts.deleteOne({ _id: debt._id });
    //   return res
    //     .status(200)
    //     .json({ message: 'Debt paid off and removed successfully', status: 'success' });
    // }

    await debt.save();
    const currentDebts = await Debts.find({ user_id: id_user }).select('-user_id -__v -interest');

    res.status(200).json({ message: 'Debt updated successfully', status: 'success', currentDebts, debt });
  } catch (error) {
    res.status(500).json({ message: 'Error updating debt', status: 'error' });
  }
});

// Get all debts for a user
router.get('/:id_user', async (req, res) => {
  const { id_user } = req.params;

  try {
    const userDebts = await Debts.find({ user_id: id_user }).select('-user_id -__v -interest');

    res.status(200).json({ userDebts, status: 'success' });

  } catch (error) {
    console.error('Error fetching debts:', error);
    res.status(500).json({ message: 'Error fetching debts', status: 'error' });
  }
});

export default router;
