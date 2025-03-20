import React, { useState } from 'react';
import axios from 'axios';

function InsightsForm() {
  const [formData, setFormData] = useState({
    eventName: '',
    eventDate: '',
    venue: '',
    budget: '',
    attendees: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/insights/add', formData);
      alert('Event Insight Added Successfully!');
      console.log(response.data);
    } catch (error) {
      console.error(error);
      alert('Failed to Add Event Insight');
    }
  };

  return (
    <form id="insightsForm" onSubmit={handleSubmit}>
      <h2 id="formTitle">Add Event Insights</h2>
      <input
        type="text"
        name="eventName"
        placeholder="Event Name"
        value={formData.eventName}
        onChange={handleChange}
        id="eventNameInput"
      />
      <input
        type="date"
        name="eventDate"
        placeholder="Event Date"
        value={formData.eventDate}
        onChange={handleChange}
        id="eventDateInput"
      />
      <input
        type="text"
        name="venue"
        placeholder="Venue"
        value={formData.venue}
        onChange={handleChange}
        id="venueInput"
      />
      <input
        type="number"
        name="budget"
        placeholder="Budget"
        value={formData.budget}
        onChange={handleChange}
        id="budgetInput"
      />
      <input
        type="number"
        name="attendees"
        placeholder="Number of Attendees"
        value={formData.attendees}
        onChange={handleChange}
        id="attendeesInput"
      />
      <button type="submit" id="submitButton">Add Insight</button>
    </form>
  );
}

export default InsightsForm;
