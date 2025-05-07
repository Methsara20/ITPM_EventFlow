import express from 'express';
import Event from '../models/Event.js';
import mongoose from 'mongoose';

const router = express.Router();


// Helper function for error handling
const handleErrors = (res, err) => {
  console.error(err);
  if (err.name === 'ValidationError') {
    return res.status(400).json({ error: err.message });
  }
  return res.status(500).json({ error: 'Server error' });
};

// 📌 Create an event (updated for frontend integration)
router.post('/', async (req, res) => {
  try {
    // Validate required fields
    if (!req.body.eventType || !req.body.eventDate || !req.body.eventTime || 
        !req.body.budget || !req.body.venue) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Create new event with combined date/time
    const newEvent = new Event({
      eventType: req.body.eventType,
      eventDate: req.body.eventDate,
      eventTime: req.body.eventTime,
      budget: Number(req.body.budget), // Ensure number type
      venue: req.body.venue
    });

    const savedEvent = await newEvent.save();
    res.status(201).json({
      ...savedEvent.toObject(),
      message: 'Event created successfully!'
    });
  } catch (err) {
    handleErrors(res, err);
  }
});

// 📌 Get all events (with sorting)
router.get('/', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 }); // Newest first
    res.json(events);
  } catch (err) {
    handleErrors(res, err);
  }
});

// 📌 Get an event by ID (with better error handling)
router.get('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    handleErrors(res, err);
  }
});

// 📌 Update an event (enhanced validation)
router.put('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    const updates = {
      ...req.body,
      ...(req.body.budget && { budget: Number(req.body.budget) }) // Ensure number
    };

    const updatedEvent = await Event.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json({
      ...updatedEvent.toObject(),
      message: 'Event updated successfully!'
    });
  } catch (err) {
    handleErrors(res, err);
  }
});

// 📌 Delete an event (with success message)
router.delete('/:id', async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ error: 'Invalid event ID' });
    }

    const deletedEvent = await Event.findByIdAndDelete(req.params.id);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json({ 
      message: 'Event deleted successfully',
      id: req.params.id
    });
  } catch (err) {
    handleErrors(res, err);
  }
});

export default router;