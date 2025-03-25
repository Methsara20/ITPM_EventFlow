const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  eventDate: { type: String, required: true },
  budget: { type: Number, required: true },
  venue: { type: String, required: true }
});

module.exports = mongoose.model('Event', EventSchema);
