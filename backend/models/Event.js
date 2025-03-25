import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  eventType: { type: String, required: true },
  eventDate: { type: String, required: true },
  budget: { type: Number, required: true },
  venue: { type: String, required: true }
});

// Export as ES Module
const Event = mongoose.model('Event', EventSchema);
export default Event;