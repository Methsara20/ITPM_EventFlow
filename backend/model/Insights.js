const mongoose = require("mongoose");

const InsightsSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  eventDate: { type: Date, required: true },
  venue: { type: String, required: true },
  budget: { type: Number, required: true },
  attendees: { type: Number, required: true },
});

module.exports = mongoose.model("Insights", InsightsSchema);
