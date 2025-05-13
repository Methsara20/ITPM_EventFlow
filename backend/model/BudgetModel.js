// BudgetModel.js (ES module version)
import mongoose from 'mongoose';

const { Schema } = mongoose;

const budgetSchema = new Schema({
  evename: { type: String, required: true },
  date: { type: Date, required: true },
  email: { type: String, required: true },
  estbudget: { type: Number, required: true },
  venue: { type: String, required: true },
  paymentdate: { type: Date, required: true },
  status: { type: String, required: true },
  actualcost: { type: Number, required: true },
  variance: { type: Number, required: true },
  notes: { type: String, required: true },
});

const Budget = mongoose.model('Budget', budgetSchema);

export default Budget;
