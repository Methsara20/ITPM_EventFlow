import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Teds = () => {
  const [eventData, setEventData] = useState({
    eventType: '',
    eventDate: '',
    budget: '',
    venue: ''
  });

  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate(); // Initialize useNavigate hook

  const validateForm = () => {
    let newErrors = {};

    if (!eventData.eventType) newErrors.eventType = 'Event type is required.';
    
    if (!eventData.eventDate) {
      newErrors.eventDate = 'Event date is required.';
    } else if (new Date(eventData.eventDate) < new Date()) {
      newErrors.eventDate = 'Event date cannot be in the past.';
    }

    if (!eventData.budget) {
      newErrors.budget = 'Budget is required.';
    } else if (eventData.budget <= 0) {
      newErrors.budget = 'Budget must be a positive number.';
    }

    if (!eventData.venue) {
      newErrors.venue = 'Venue is required.';
    } else if (eventData.venue.length < 3) {
      newErrors.venue = 'Venue must be at least 3 characters long.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData(prevState => ({
      ...prevState,
      [name]: name === "budget" ? Number(value) : value
    }));
  };

  const handleDateChange = (e) => {
    setEventData(prevState => ({
      ...prevState,
      eventDate: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:3000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      });

      const result = await response.json();

      if (response.ok) {
        setMessage('✅ Event created successfully!');
        setEventData({ eventType: '', eventDate: '', budget: '', venue: '' });
        setErrors({});
        navigate('/events'); // Navigate to the events page on successful form submission
      } else {
        setMessage(result.error || '❌ Error creating event');
      }
    } catch (error) {
      setMessage('❌ Server error. Please try again later.');
    }
  };

  return (
    <div className="container mt-5 p-4 bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-center text-2xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Event Planning Form</h2>
      {message && <p className="text-center text-green-500 font-bold mb-4">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="eventType" className="block text-lg font-medium text-gray-700">Event Type:</label>
          <select
            id="eventType"
            name="eventType"
            value={eventData.eventType}
            onChange={handleChange}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Event Type</option>
            <option value="wedding">Wedding</option>
            <option value="corporate">Corporate Event</option>
            <option value="birthday">Birthday Party</option>
            <option value="conference">Conference</option>
            <option value="other">Other</option>
          </select>
          {errors.eventType && <p className="text-red-500 mt-2 text-sm">{errors.eventType}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="eventDate" className="block text-lg font-medium text-gray-700">Event Date:</label>
          <input
            type="date"
            id="eventDate"
            name="eventDate"
            value={eventData.eventDate}
            onChange={handleDateChange}
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.eventDate && <p className="text-red-500 mt-2 text-sm">{errors.eventDate}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="budget" className="block text-lg font-medium text-gray-700">Budget ($):</label>
          <input
            type="number"
            id="budget"
            name="budget"
            value={eventData.budget}
            onChange={handleChange}
            placeholder="Enter your budget"
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.budget && <p className="text-red-500 mt-2 text-sm">{errors.budget}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="venue" className="block text-lg font-medium text-gray-700">Venue:</label>
          <input
            type="text"
            id="venue"
            name="venue"
            value={eventData.venue}
            onChange={handleChange}
            placeholder="Enter venue name or location"
            required
            className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {errors.venue && <p className="text-red-500 mt-2 text-sm">{errors.venue}</p>}
        </div>

        <button type="submit" className="mt-4 w-full py-3 px-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full ...">
          Submit
        </button>
      </form>
    </div>
  );
};

export default Teds;
