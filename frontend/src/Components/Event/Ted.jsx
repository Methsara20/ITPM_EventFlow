import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  EventTypeOptions, 
  EventBudgetOptions,
  EventTimeOptions,
  EVENT_AI_PROMPT 
} from "../constants/options";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { generateContent } from "../../service/AIModel";

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    eventType: "",
    eventDate: "",
    eventTime: "",
    budget: "",
    venue: ""
  });
  
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [aiPlan, setAiPlan] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVenueSearch = (query) => {
    // Mock search implementation
    const mockResults = [
      { id: 1, display_name: `${query} Convention Center` },
      { id: 2, display_name: `${query} Hotel Ballroom` },
      { id: 3, display_name: `${query} Garden Venue` }
    ];
    setSearchResults(mockResults);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          budget: Number(formData.budget)
        })
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to create event");

      toast.success("Event created successfully!");
      navigate('/events');
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateAIPlan = async () => {
    if (!formData.eventType || !formData.venue) {
      toast.error("Please select event type and venue first");
      return;
    }
  
    setIsGeneratingPlan(true);
    try {
      const prompt = EVENT_AI_PROMPT
        .replace(/{eventType}/g, formData.eventType)
        .replace(/{eventDate}/g, formData.eventDate)
        .replace(/{eventTime}/g, formData.eventTime)
        .replace(/{venue}/g, formData.venue)
        .replace(/{budget}/g, formData.budget);
  
      const response = await generateContent(prompt);
      
      // First check if response is already an object
      let plan = typeof response === 'string' ? JSON.parse(response) : response;
      
      // Fallback if parsing fails
      if (!plan || typeof plan !== 'object') {
        console.warn("Unexpected API response format:", response);
        plan = {
          eventOverview: {
            type: formData.eventType,
            date: formData.eventDate,
            venue: formData.venue,
            budget: formData.budget
          },
          vendors: [],
          timeline: [],
          checklist: []
        };
      }
  
      setAiPlan(plan);
      toast.success("AI plan generated successfully!");
    } catch (error) {
      console.error("Full generation error:", error);
      toast.error(`AI generation failed: ${error.message}`);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
        Create Your Event
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Event Type Selection */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Event Type</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {EventTypeOptions.map(option => (
              <button
                key={option.id}
                type="button"
                className={`p-4 rounded-lg border-2 transition-all ${
                  formData.eventType === option.value 
                    ? "border-purple-500 bg-purple-50" 
                    : "border-gray-200 hover:border-purple-300"
                }`}
                onClick={() => handleInputChange("eventType", option.value)}
              >
                <div className="text-3xl mb-2">{option.icon}</div>
                <h3 className="font-medium">{option.title}</h3>
                <p className="text-sm text-gray-500">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Date and Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Event Date</label>
            <input
              type="date"
              className="w-full p-3 border rounded-lg"
              value={formData.eventDate}
              onChange={(e) => handleInputChange("eventDate", e.target.value)}
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Time Slot</label>
            <div className="grid grid-cols-2 gap-3">
              {EventTimeOptions.map(option => (
                <button
                  key={option.id}
                  type="button"
                  className={`p-3 rounded-lg border transition-all ${
                    formData.eventTime === option.value
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300"
                  }`}
                  onClick={() => handleInputChange("eventTime", option.value)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{option.icon}</span>
                    <span>{option.title}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Budget Selection */}
        <div>
          <h2 className="text-xl font-semibold mb-3">Budget Range</h2>
          <div className="grid grid-cols-3 gap-4">
            {EventBudgetOptions.map(option => (
              <button
                key={option.id}
                type="button"
                className={`p-4 rounded-lg border transition-all ${
                  formData.budget === option.value
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-green-300"
                }`}
                onClick={() => handleInputChange("budget", option.value)}
              >
                <div className="text-2xl mb-2">{option.icon}</div>
                <h3 className="font-medium">{option.title}</h3>
                <p className="text-sm text-gray-500">{option.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Venue Selection */}
        <div>
          <label className="block text-sm font-medium mb-1">Venue</label>
          <input
            type="text"
            className="w-full p-3 border rounded-lg mb-2"
            value={formData.venue}
            onChange={(e) => {
              handleInputChange("venue", e.target.value);
              handleVenueSearch(e.target.value);
            }}
            placeholder="Search for venues..."
            required
          />
          
          {searchResults.length > 0 && (
            <div className="border rounded-lg overflow-hidden">
              {searchResults.map(venue => (
                <div
                  key={venue.id}
                  className="p-3 border-b hover:bg-gray-50 cursor-pointer"
                  onClick={() => {
                    handleInputChange("venue", venue.display_name);
                    setSelectedVenue(venue);
                    setSearchResults([]);
                  }}
                >
                  {venue.display_name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-70"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                Creating...
              </span>
            ) : "Create Event"}
          </button>

          <button
            type="button"
            onClick={generateAIPlan}
            disabled={isGeneratingPlan}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-70"
          >
            {isGeneratingPlan ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                </svg>
                Generating Plan...
              </span>
            ) : "Generate AI Plan"}
          </button>
        </div>
      </form>

      {/* AI Plan Display */}
      {aiPlan && (
        <div className="mt-8 border rounded-lg p-6 bg-white shadow-lg">
          <h2 className="text-2xl font-bold mb-4">AI-Generated Event Plan</h2>
          
          {/* Vendor Recommendations */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Vendor Recommendations</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(aiPlan.vendorRecommendations).map(([category, vendors]) => (
                <div key={category} className="border rounded-lg p-4">
                  <h4 className="font-medium capitalize mb-2">{category}</h4>
                  {vendors.slice(0, 3).map((vendor, i) => (
                    <div key={i} className="mb-3 pb-3 border-b last:border-b-0">
                      <p className="font-medium">{vendor.companyName}</p>
                      <p className="text-sm text-gray-600">{vendor.serviceDescription}</p>
                      <p className="text-sm"><span className="font-medium">Price:</span> {vendor.priceRange}</p>
                      {vendor.contact && (
                        <p className="text-sm"><span className="font-medium">Contact:</span> {vendor.contact.phone}</p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Event Timeline */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-3">Event Timeline</h3>
            <div className="space-y-3">
              {aiPlan.eventTimeline.map((item, i) => (
                <div key={i} className="flex gap-4 p-3 border rounded-lg">
                  <div className="font-medium min-w-[120px]">{item.time}</div>
                  <div>
                    <p className="font-medium">{item.activity}</p>
                    <p className="text-sm text-gray-600">Responsible: {item.responsibleParty}</p>
                    {item.resourcesNeeded?.length > 0 && (
                      <p className="text-sm">
                        <span className="font-medium">Resources:</span> {item.resourcesNeeded.join(', ')}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checklist */}
          <div>
            <h3 className="text-xl font-semibold mb-3">Checklist</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aiPlan.checklist.map((category, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <h4 className="font-medium mb-2">{category.category}</h4>
                  <ul className="space-y-2">
                    {category.items.slice(0, 5).map((item, j) => (
                      <li key={j} className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>{item.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CreateEvent;