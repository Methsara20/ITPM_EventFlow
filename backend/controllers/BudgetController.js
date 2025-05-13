import Budget from '../model/BudgetModel.js';  // Use ES module import syntax

// Get All Budget Forms
export const getAllBudget = async (req, res, next) => {
    let budgets;
    try {
        budgets = await Budget.find();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error fetching budgets" });
    }

    // If no budgets found
    if (!budgets || budgets.length === 0) {
        return res.status(404).json({ message: "No budgets found" });
    }

    return res.status(200).json({ budgets });
};

// Data Insert
export const addBudget = async (req, res, next) => {
    const { evename, date, email, estbudget, venue, paymentdate, status, actualcost, variance, notes } = req.body;

    // Validate email format (should contain @)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format. Please provide a valid email with an "@" symbol.' });
    }

    let budgets;

    try {
        budgets = new Budget({ evename, date, email, estbudget, venue, paymentdate, status, actualcost, variance, notes });
        await budgets.save();
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error saving budget" });
    }

    return res.status(201).json({ budgets });
};

// Get By ID
export const getById = async (req, res, next) => {
    const id = req.params.id;
    let budget;

    try {
        budget = await Budget.findById(id);
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error retrieving budget by ID" });
    }

    if (!budget) {
        return res.status(404).json({ message: "Budget form not found" });
    }

    return res.status(200).json({ budget });
};

// Update Budget
export const updateBudget = async (req, res, next) => {
    const id = req.params.id;
    const { evename, date, email, estbudget, venue, paymentdate, status, actualcost, variance, notes } = req.body;

    // Validate email format (should contain @)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ message: 'Invalid email format. Please provide a valid email with an "@" symbol.' });
    }

    let budgets;

    try {
        budgets = await Budget.findByIdAndUpdate(
            id,
            { evename, date, email, estbudget, venue, paymentdate, status, actualcost, variance, notes },
            { new: true } // This ensures the updated document is returned
        );
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error updating budget" });
    }

    if (!budgets) {
        return res.status(404).json({ message: "Budget form not found" });
    }

    return res.status(200).json({ budgets });
};

// Delete Budget
export const deleteBudget = async (req, res, next) => {
    const id = req.params.id;
    let budget;

    try {
        // Pass an object with _id as key for deletion
        budget = await Budget.findOneAndDelete({ _id: id });
    } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Error deleting budget" });
    }

    if (!budget) {
        return res.status(404).json({ message: "Budget form not found" });
    }

    return res.status(200).json({ message: "Budget deleted successfully", budget });
};
