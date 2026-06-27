import express from 'express';
import { Loans } from '../models/loans.js';
import { __awaiter } from 'tslib';

const router = express.Router();

// Get loan by type
router.get('/:user_id/:type_loan', async (req, res) => {
  const { user_id, type_loan } = req.params;

  try {
    const loan = await Loans.find({ user_id: user_id, typeLoand: type_loan }).sort({
      createAt: -1,
    });

    return res.status(200).json({ loan });
  } catch (error) {
    console.log('Ha ocurrido un error al obtener los prestamos: ', error);
    return res.status(400).json({ message: 'Ocurrio un error en el servidor', error });
  }
});

// Get all loans
router.get('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const allLoans = await Loans.find({ user_id: user_id }).sort({ createAt: -1 });

    return res.status(200).json({ allLoans });
  } catch (error) {
    console.log('Ocurrio un error al obtener los prestamos: ', error);
    return res.status(400).json({ message: 'Ocurrio un error en el servidor', error });
  }
});

// New loan
router.post('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { nameLoand, amountLoand, typeLoand } = req.body;

  try {
    const newLoand = new Loans({
      user_id: user_id,
      nameLoand: nameLoand,
      totalLoanded: amountLoand,
      typeLoand: typeLoand,
    });

    await newLoand.save();

    const allLoans = await Loans.find({ user_id: user_id }).sort({ createAt: -1 });

    return res.status(200).json({
      messsage: 'Se ha creado el prestamo con exito',
      allLoans,
    });

    console.log(`${nameLoand} ${amountLoand} ${typeLoand}`);
  } catch (error) {
    console.log('Ocurrio un error al registrar el prestamos: ', error);
    return res.status(400).json({ message: 'Ocurrio un error en el servidor', error });
  }
});

// Pay loan
router.put('/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { nameLoand, amountLoand } = req.body;

  const amountNumber = Number(amountLoand);

  try {
    const userLoand = await Loans.updateOne(
      { user_id: user_id, nameLoand: nameLoand },
      {
        $inc: {
          totalPaid: amountLoand,
          totalLoanded: -amountNumber,
        },
      },
    );

    return res.status(200).json({
      Message: 'El prestamo se actualizo correctamente',
      userLoand,
    });
  } catch (error) {
    console.log('Ocurrio un error al actualizar: ', error);
    return res.status(400).json({ message: 'Ocurrio un error en el servidor', error });
  }
});

// Add more loan
router.put('/addLoand/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { nameLoand, amountLoand } = req.body;

  try {
    const userLoand = await Loans.updateOne(
      { user_id: user_id, nameLoand: nameLoand },
      { $inc: { totalPaid: amountLoand } },
    );

    const user = await Loans.findOne({ user_id: user_id, nameLoand: nameLoand });

    user.percentage = Math.round((user.totalPaid / user.totalLoanded) * 100);

    await user.save();

    const allLoans = await Loans.find({user_id: user_id})

    return res.status(200).json({
      message: 'Exito al actualizar la deuda',
      currentLoans: allLoans,
    });
  } catch (error) {
    console.log('Ha ocurrido un error al agregar prestamo: ', error);
    return res.status(400).json({ message: 'Ocurrio un error en el servidor', error });
  }
});

export default router;
