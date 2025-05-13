import express from 'express';
import {
    getAllBudget,
    addBudget,
    getById,
    updateBudget,
    deleteBudget
} from '../controllers/BudgetController.js';

const router = express.Router();

router.get('/', getAllBudget);
router.post('/', addBudget);
router.get('/:id', getById);
router.put('/:id', updateBudget);
router.delete('/:id', deleteBudget);

export default router;