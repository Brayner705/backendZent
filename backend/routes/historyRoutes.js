import express from 'express';
import { History } from '../models/history.js';
import { User } from '../models/user.js';

const router = express.Router();

// Record history for a user
router.post('/user', async (req, res) => {
  try {
    const { user_id, nameMovement, typeOperation, money } = req.body;

    const history = new History({ user_id, nameMovement, typeOperation, money });
    const historySave = await history.save();
    res
      .status(201)
      .json({ message: 'History recorded successfully', status: 'true', history: historySave });
  } catch (error) {
    console.error('Error saving history:', error);
    res.status(500).json({ error: 'Error saving history', status: 'false' });
  }
});

// Get history for a user Income limited to 5 records
router.get('/user/:user_id', async (req,res)=> {
  try {

    const { user_id } = req.params;

    const user = await User.findById(user_id);
    const history = await History.find({ user_id }).sort({ createdAt: -1 }).limit(5);

    if(!user) {
      return res.status(404).json({ message: 'User not found', status: 'false' });
    }

    res.status(200).json({ history, status: 'true' });

  } catch (error) {
    console.error('Error fetching history:', error);
    res.status(500).json({ error: 'Error fetching history', status: 'false' });
  }
})

export default router;