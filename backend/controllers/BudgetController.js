import Budget from "../model/BudgetModel.js";

// Get All Budget Forms
export const getAllBudget = async (req, res, next) => {
    let budgets;
    try {
        budgets = await Budget.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching budgets" });
    }

    if (!budgets || budgets.length === 0) {
        return res.status(404).json({ message: "No budgets found" });
    }

    return res.status(200).json({ budgets });
};

// Data Insert
export const addBudget = async (req, res, next) => {
    const { evename, date, email, estbudget, venue, paymentdate, status, actualcost, variance, notes } = req.body;

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }

    try {
        const budget = new Budget({ 
            evename, 
            date, 
            email, 
            estbudget, 
            venue, 
            paymentdate, 
            status, 
            actualcost, 
            variance, 
            notes 
        });
        await budget.save();
        return res.status(201).json({ budget });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error saving budget" });
    }
};

// Get By ID
export const getById = async (req, res, next) => {
    const id = req.params.id;
    try {
        const budget = await Budget.findById(id);
        if (!budget) {
            return res.status(404).json({ message: "Budget form not found" });
        }
        return res.status(200).json({ budget });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error retrieving budget" });
    }
};

// Update Budget
export const updateBudget = async (req, res, next) => {
    const id = req.params.id;
    const updateData = req.body;

    if (updateData.email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(updateData.email)) {
            return res.status(400).json({ message: 'Invalid email format' });
        }
    }

    try {
        const budget = await Budget.findByIdAndUpdate(id, updateData, { new: true });
        if (!budget) {
            return res.status(404).json({ message: "Budget form not found" });
        }
        return res.status(200).json({ budget });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating budget" });
    }
};

// Delete Budget
export const deleteBudget = async (req, res, next) => {
    const id = req.params.id;
    try {
        const budget = await Budget.findByIdAndDelete(id);
        if (!budget) {
            return res.status(404).json({ message: "Budget form not found" });
        }
        return res.status(200).json({ message: "Budget deleted successfully", budget });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error deleting budget" });
    }
};