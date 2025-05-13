import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "tailwindcss/tailwind.css";

// Add this constant for time slot options
const EventTimeOptions = [
  { id: 1, value: "morning", title: "Morning (8AM-12PM)", icon: "🌅" },
  { id: 2, value: "afternoon", title: "Afternoon (12PM-5PM)", icon: "☀️" },
  { id: 3, value: "evening", title: "Evening (5PM-9PM)", icon: "🌇" },
  { id: 4, value: "night", title: "Night (9PM-12AM)", icon: "🌃" }
];

const UpdateEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [eventData, setEventData] = useState({
    eventType: "",
    eventDate: "",
    eventTime: "", // Add eventTime to state
    budget: "",
    venue: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/events/${id}`);
        setEventData(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const validateForm = () => {
    let validationErrors = {};
    if (!eventData.eventType.trim()) {
      validationErrors.eventType = "Event type is required";
    }
    if (!eventData.eventDate) {
      validationErrors.eventDate = "Event date is required";
    } else if (new Date(eventData.eventDate) < new Date()) {
      validationErrors.eventDate = "Event date must be in the future";
    }
    if (!eventData.eventTime) {
      validationErrors.eventTime = "Time slot is required"; // Add validation for time slot
    }
    if (!eventData.budget || isNaN(eventData.budget) || eventData.budget <= 0) {
      validationErrors.budget = "Budget must be a positive number";
    }
    if (!eventData.venue.trim()) {
      validationErrors.venue = "Venue is required";
    }
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData((prev) => ({
      ...prev,
      [name]: name === "budget" ? parseFloat(value) || "" : value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Add handler for time slot selection
  const handleTimeSlotChange = (time) => {
    setEventData(prev => ({
      ...prev,
      eventTime: time
    }));
    if (errors.eventTime) {
      setErrors(prev => ({ ...prev, eventTime: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    try {
      setLoading(true);
      await axios.put(`http://localhost:5001/api/events/${id}`, eventData);
      setMessage("Event updated successfully!");
      setTimeout(() => navigate("/events"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Error updating event");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-red-50 rounded-lg shadow-md">
        <div className="flex items-center justify-center">
          <svg className="h-6 w-6 text-red-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="text-xl font-bold text-red-600">Error</h2>
        </div>
        <p className="mt-4 text-center text-red-700">{error}</p>
        <button
          onClick={() => navigate("/events")}
          className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-md transition duration-300"
        >
          Back to Events
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Update Event Details
          </h1>
          <p className="mt-3 text-lg text-gray-600">
            Edit the information for your event below
          </p>
        </div>

        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            {message && (
              <div className="mb-6 p-4 bg-green-100 border-l-4 border-green-500 text-green-700 rounded">
                <div className="flex items-center">
                  <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="font-medium">{message}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="eventType" className="block text-sm font-medium text-gray-700">
                  Event Type <span className="text-red-500">*</span>
                </label>
                <select
                  id="eventType"
                  name="eventType"
                  value={eventData.eventType}
                  onChange={handleChange}
                  className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border ${errors.eventType ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm`}
                >
                  <option value="">Select Event Type</option>
                  <option value="wedding">Wedding</option>
                  <option value="corporate">Corporate Event</option>
                  <option value="birthday">Birthday Party</option>
                  <option value="conference">Conference</option>
                  <option value="other">Other</option>
                </select>
                {errors.eventType && (
                  <p className="mt-2 text-sm text-red-600">{errors.eventType}</p>
                )}
              </div>

              <div>
                <label htmlFor="eventDate" className="block text-sm font-medium text-gray-700">
                  Event Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  id="eventDate"
                  name="eventDate"
                  value={eventData.eventDate}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.eventDate ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm`}
                />
                {errors.eventDate && (
                  <p className="mt-2 text-sm text-red-600">{errors.eventDate}</p>
                )}
              </div>

              {/* Add Time Slot Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Time Slot <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {EventTimeOptions.map(option => (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => handleTimeSlotChange(option.value)}
                      className={`p-3 rounded-lg border transition-all ${
                        eventData.eventTime === option.value
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{option.icon}</span>
                        <span>{option.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.eventTime && (
                  <p className="mt-2 text-sm text-red-600">{errors.eventTime}</p>
                )}
              </div>

              <div>
                <label htmlFor="budget" className="block text-sm font-medium text-gray-700">
                  Budget ($) <span className="text-red-500">*</span>
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    id="budget"
                    name="budget"
                    value={eventData.budget}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className={`block w-full pl-7 pr-12 py-2 border ${errors.budget ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm`}
                    placeholder="0.00"
                  />
                </div>
                {errors.budget && (
                  <p className="mt-2 text-sm text-red-600">{errors.budget}</p>
                )}
              </div>

              <div>
                <label htmlFor="venue" className="block text-sm font-medium text-gray-700">
                  Venue <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="venue"
                  name="venue"
                  value={eventData.venue}
                  onChange={handleChange}
                  className={`mt-1 block w-full px-3 py-2 border ${errors.venue ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-md shadow-sm`}
                  placeholder="Enter venue location"
                />
                {errors.venue && (
                  <p className="mt-2 text-sm text-red-600">{errors.venue}</p>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => navigate("/events")}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Update Event
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateEvent;