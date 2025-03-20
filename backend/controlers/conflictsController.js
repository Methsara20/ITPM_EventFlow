import Conflicts from "../model/Conflicts.js";
import { analyzeEventConflict } from "../utils/aiHelper.js";

export const detectConflict = async (req, res) => {
  try {
    const conflictAnalysis = await analyzeEventConflict(req.body);
    const conflict = new Conflicts({ ...req.body, details: conflictAnalysis });
    await conflict.save();
    res.status(201).json(conflict);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
