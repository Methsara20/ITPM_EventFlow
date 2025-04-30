const mongoose = require("mongoose");
//import Conflicts from "../model/Conflicts.js";


const ConflictSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Insights", required: true },
  conflictType: { type: String, required: true }, // e.g., "Date", "Venue"
  details: { type: String },
  resolved: { type: Boolean, default: false },
});

//module.exports = mongoose.model("Conflict", ConflictSchema);
export default mongoose.model("Conflict", ConflictSchema);
