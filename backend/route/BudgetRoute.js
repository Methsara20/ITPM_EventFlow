// BudgetRoute.js (ES module version)
import express from 'express';
const router = express.Router();

// Importing the model and controller using ES module syntax
import Budget from '../model/BudgetModel.js';
import * as BudgetController from '../controllers/BudgetController.js';

// Define your routes
router.get('/budget', BudgetController.getAllBudget);
router.post('/', BudgetController.addBudget);
router.get('/:id', BudgetController.getById);
router.put('/:id', BudgetController.updateBudget);
router.delete('/:id', BudgetController.deleteBudget);

// Export the router using ES module syntax
export default router;
