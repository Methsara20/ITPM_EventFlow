import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();
  const [selectedVenue, setSelectedVenue] = useState(location.state?.selectedVenue || null);
  const [formData, setFormData] = useState({
    eventType: "",
    eventDate: "",
    eventTime: "",
    budget: ""
  });
  
  const [aiPlan, setAiPlan] = useState({
    vendorRecommendations: {},
    eventTimeline: [],
    checklist: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [isSavingPlan, setIsSavingPlan] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!selectedVenue) {
      navigate("/selectevent");
    }
  }, [selectedVenue, navigate]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
          venue: selectedVenue.display_name,
          venuePhoto: selectedVenue.photo,
          venueLocation: {
            lat: selectedVenue.lat,
            lon: selectedVenue.lon
          },
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
    if (!formData.eventType) {
      toast.error("Please select event type first");
      return;
    }
  
    setIsGeneratingPlan(true);
    try {
      const prompt = EVENT_AI_PROMPT
        .replace(/{eventType}/g, formData.eventType)
        .replace(/{eventDate}/g, formData.eventDate)
        .replace(/{eventTime}/g, formData.eventTime)
        .replace(/{venue}/g, selectedVenue.display_name)
        .replace(/{budget}/g, formData.budget);
  
      const response = await generateContent(prompt);
      
      let plan = typeof response === 'string' ? JSON.parse(response) : response;
      
      const safePlan = {
        vendorRecommendations: plan.vendorRecommendations || {},
        eventTimeline: plan.eventTimeline || [],
        checklist: plan.checklist || [],
        ...plan
      };
  
      setAiPlan(safePlan);
      toast.success("AI plan generated successfully!");
    } catch (error) {
      console.error("Full generation error:", error);
      toast.error(`AI generation failed: ${error.message}`);
      setAiPlan({
        vendorRecommendations: {},
        eventTimeline: [],
        checklist: []
      });
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  const handleSavePlan = async () => {
    if (!aiPlan || Object.keys(aiPlan.vendorRecommendations).length === 0) {
      toast.error("Please generate a plan first");
      return;
    }

    setIsSavingPlan(true);
    try {
      const response = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          venue: selectedVenue.display_name,
          venuePhoto: selectedVenue.photo,
          venueLocation: {
            lat: selectedVenue.lat,
            lon: selectedVenue.lon
          },
          budget: Number(formData.budget),
          aiPlan: aiPlan
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Failed to save plan");

      toast.success("Event plan saved successfully!");
      navigate(`/events/${data._id}`);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsSavingPlan(false);
    }
  };

  if (!selectedVenue) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
        Create Your Event
      </h1>

      {/* Back Button */}
      <button 
        onClick={() => navigate("/")} 
        className="text-blue-500 hover:text-blue-700 font-medium mb-6"
      >
        Back to Home
      </button>
      
      <div className="mb-8 p-4 border rounded-lg bg-gray-50 shadow-sm">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <img 
              src={selectedVenue.photo} 
              alt={selectedVenue.display_name}
              className="w-20 h-20 object-cover rounded"
            />
            <div>
              <h3 className="font-bold text-lg">Selected Venue</h3>
              <p className="font-medium">{selectedVenue.display_name}</p>
            </div>
          </div>
          <button 
            onClick={() => navigate("/selectevent")}
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Change venue
          </button>
        </div>
      </div>
      
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

        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting || !formData.eventType}
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
            disabled={isGeneratingPlan || !formData.eventType}
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
      {aiPlan && Object.keys(aiPlan.vendorRecommendations).length > 0 && (
        <div className="mt-8 border rounded-lg p-6 bg-white shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">AI-Generated Event Plan</h2>
            <button
              onClick={handleSavePlan}
              disabled={isSavingPlan}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-70"
            >
              {isSavingPlan ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  </svg>
                  Saving...
                </span>
              ) : "Save This Plan"}
            </button>
          </div>
          
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