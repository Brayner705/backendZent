import express from 'express';
import { User } from '../models/user.js';
import { Spent } from '../models/spent.js';
import { Debts } from '../models/debts.js';

const router = express.Router();

// User registration endpoint
router.post('/user/record', async (req, res) => {
  const { username, password } = req.body;

  try {
    const newUser = new User({ username, password });
    const userSave = await newUser.save();

    // Add Spent document for the user if it doesn't exist
    const newSpent = new Spent({ user_id: userSave._id });
    await newSpent.save();


    res
      .status(201)
      .json({ message: 'User registered successfully', status: 'true', user: userSave });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).send({ error: 'Username already exists' });
    }
    return res.status(500).send({ error: 'Error registering user' });
  }
});

export default router;
