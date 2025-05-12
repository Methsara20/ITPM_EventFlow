import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiPrinter,
  FiArrowLeft
} from "react-icons/fi";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Navbar } from "../NavBar/Navbar";

const getTimeSlotDisplay = (timeValue) => {
  const timeSlots = {
    "morning": "Morning (9AM-12PM)",
    "afternoon": "Afternoon (1PM-5PM)",
    "evening": "Evening (6PM-11PM)",
    "full-day": "Full Day (9AM-11PM)"
  };
  return timeSlots[timeValue] || timeValue;
};

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events");
        if (!response.ok) {
          throw new Error("Failed to fetch events");
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError(err.message);
        toast.error(`Error loading events: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        const response = await fetch(`http://localhost:5000/api/events/${id}`, {
          method: "DELETE"
        });

        if (!response.ok) {
          throw new Error("Failed to delete event");
        }
        
        setEvents(events.filter((event) => event._id !== id));
        toast.success("Event deleted successfully");
      } catch (err) {
        toast.error(`Error deleting event: ${err.message}`);
      }
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-event/${id}`);
  };

  const handleViewPlan = (event) => {
    navigate(`/event-plan/${event._id}`, { state: { event } });
  };

  const handleCreateNew = () => {
    navigate("/selectevent");
  };

  const generateReport = () => {
    const doc = new jsPDF();

    // Report header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(40, 53, 147);
    doc.text("EventFlow - Events Report", 14, 20);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Summary stats
    const totalEvents = events.length;
    const totalBudget = events.reduce((sum, event) => sum + (event.budget || 0), 0);
    const upcomingEvents = events.filter(event => 
      new Date(event.eventDate) > new Date()
    ).length;

    doc.setFontSize(14);
    doc.text("Summary Statistics", 14, 45);
    doc.text(`- Total Events: ${totalEvents}`, 20, 55);
    doc.text(`- Upcoming Events: ${upcomingEvents}`, 20, 65);
    doc.text(`- Total Budget: $${totalBudget.toLocaleString()}`, 20, 75);

    // Events table
    doc.setFontSize(16);
    doc.text("All Events", 14, 90);

    const tableHeaders = [
      ["Event Type", "Venue", "Date", "Time", "Budget", "Status"]
    ];

    const tableData = events.map(event => [
      event.eventType,
      event.venue,
      new Date(event.eventDate).toLocaleDateString(),
      event.eventTime ? getTimeSlotDisplay(event.eventTime) : "Not specified",
      `$${event.budget?.toLocaleString() || "0"}`,
      new Date(event.eventDate) > new Date() ? "Upcoming" : "Completed"
    ]);

    autoTable(doc, {
      startY: 95,
      head: tableHeaders,
      body: tableData,
      theme: "grid",
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: "bold"
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240]
      },
      margin: { left: 14 }
    });

    doc.save("EventFlow_Report.pdf");
  };

  const filteredEvents = events.filter(event =>
    event.eventType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-md">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col space-y-6">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => navigate("/")}
                className="flex items-center space-x-2 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <FiArrowLeft className="text-lg" />
                <span className="font-medium">Back to Home</span>
              </button>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-pink-600">
                My Events
              </h1>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-grow max-w-md">
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button 
                  onClick={generateReport}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg shadow hover:opacity-90 transition-opacity"
                >
                  <FiPrinter size={18} />
                  <span>Generate Report</span>
                </button>
                <button 
                  onClick={handleCreateNew}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg shadow hover:opacity-90 transition-opacity"
                >
                  <span>+ Create New</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Events List */}
          <div className="grid gap-6">
            {filteredEvents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <FiCalendar className="text-gray-400 text-3xl" />
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  {searchTerm ? "No matching events found" : "No events yet"}
                </h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm 
                    ? "Try a different search term" 
                    : "Get started by creating your first event"}
                </p>
                {!searchTerm && (
                  <button
                    onClick={handleCreateNew}
                    className="mt-4 px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-lg shadow hover:opacity-90 transition-opacity"
                  >
                    Create New Event
                  </button>
                )}
              </div>
            ) : (
              filteredEvents.map((event) => (
                <div key={event._id} className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg">
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-xl font-semibold text-gray-800">{event.eventType}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            new Date(event.eventDate) > new Date()
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}>
                            {new Date(event.eventDate) > new Date() ? "Upcoming" : "Past"}
                          </span>
                        </div>
                        
                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <FiMapPin className="text-indigo-500" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiDollarSign className="text-green-500" />
                            <span>${event.budget?.toLocaleString() || "0"}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <FiCalendar className="text-purple-500" />
                            <span>
                              {new Date(event.eventDate).toLocaleDateString('en-US', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                          {event.eventTime && (
                            <div className="flex items-center space-x-2">
                              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{getTimeSlotDisplay(event.eventTime)}</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleUpdate(event._id)}
                          className="flex items-center space-x-2 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors"
                        >
                          <FiEdit2 size={16} />
                          <span>Edit</span>
                        </button>
                        <button
                          onClick={() => handleDelete(event._id)}
                          className="flex items-center space-x-2 px-3 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                        >
                          <FiTrash2 size={16} />
                          <span>Delete</span>
                        </button>
                        <button
                          onClick={() => handleViewPlan(event)}
                          className="flex items-center space-x-2 px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                        >
                          <FiEye size={16} />
                          <span>View Plan</span>
                        </button>
                      </div>
                    </div>
                    
                    {event.aiPlan && (
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <h4 className="font-medium text-gray-700 mb-2">AI Plan Highlights</h4>
                        <div className="flex flex-wrap gap-2">
                          {event.aiPlan.vendorRecommendations && (
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs rounded-full">
                              {Object.keys(event.aiPlan.vendorRecommendations).length} vendors
                            </span>
                          )}
                          {event.aiPlan.eventTimeline && (
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                              {event.aiPlan.eventTimeline.length} timeline items
                            </span>
                          )}
                          {event.aiPlan.checklist && (
                            <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-full">
                              {event.aiPlan.checklist.reduce((sum, cat) => sum + cat.items.length, 0)} checklist items
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsList;