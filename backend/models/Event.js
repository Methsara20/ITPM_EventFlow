import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  eventDate: { type: String, required: true },
  eventTime: { type: String, required: true }, // Added time field
  budget: { type: Number, required: true },
  venue: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Event = mongoose.model('Event', EventSchema);
export default Event;