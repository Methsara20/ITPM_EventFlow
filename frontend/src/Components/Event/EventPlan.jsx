import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { generateContent } from '../../service/AIModel';
import { EVENT_AI_PROMPT } from '../constants/options';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const EventPlan = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const [aiPlan, setAiPlan] = useState({
    vendorRecommendations: {},
    eventTimeline: [],
    checklist: []
  });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${id}`);
        setEvent(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch event details');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const generateAIPlan = async () => {
    if (!event) {
      toast.error("Event details not available");
      return;
    }
  
    setIsGeneratingPlan(true);
    try {
      const prompt = EVENT_AI_PROMPT
        .replace(/{eventType}/g, event.eventType)
        .replace(/{eventDate}/g, event.eventDate)
        .replace(/{eventTime}/g, event.eventTime)
        .replace(/{venue}/g, event.venue)
        .replace(/{budget}/g, event.budget);
  
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

  const downloadPlanAsPDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('AI-Generated Event Plan', 14, 18);
    let y = 28;
    doc.setFontSize(12);
    doc.text(`Event: ${event.eventType}`, 14, y);
    doc.text(`Date: ${new Date(event.eventDate).toLocaleDateString()}`, 14, y + 8);
    doc.text(`Time: ${event.eventTime}`, 14, y + 16);
    doc.text(`Venue: ${event.venue}`, 14, y + 24);
    doc.text(`Budget: $${event.budget}`, 14, y + 32);
    doc.text(`Description: ${event.description}`, 14, y + 40);
    y += 50;
    // Vendor Recommendations
    if (aiPlan.vendorRecommendations && Object.keys(aiPlan.vendorRecommendations).length > 0) {
      doc.setFontSize(14);
      doc.text('Vendor Recommendations', 14, y);
      y += 6;
      Object.entries(aiPlan.vendorRecommendations).forEach(([category, vendors]) => {
        doc.setFontSize(12);
        doc.text(`- ${category}:`, 16, y);
        y += 6;
        vendors.slice(0, 3).forEach((vendor) => {
          doc.text(`  • ${vendor.companyName} (${vendor.priceRange})`, 18, y);
          y += 6;
        });
      });
      y += 4;
    }
    // Event Timeline
    if (aiPlan.eventTimeline && aiPlan.eventTimeline.length > 0) {
      doc.setFontSize(14);
      doc.text('Event Timeline', 14, y);
      y += 4;
      autoTable(doc, {
        startY: y + 2,
        head: [['Time', 'Activity', 'Responsible', 'Resources']],
        body: aiPlan.eventTimeline.map(item => [
          item.time,
          item.activity,
          item.responsibleParty,
          (item.resourcesNeeded || []).join(', ')
        ]),
        theme: 'grid',
        styles: { fontSize: 10 },
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        margin: { left: 14, right: 14 }
      });
      y = doc.lastAutoTable.finalY + 6;
    }
    // Checklist
    if (aiPlan.checklist && aiPlan.checklist.length > 0) {
      doc.setFontSize(14);
      doc.text('Checklist', 14, y);
      y += 4;
      aiPlan.checklist.forEach(category => {
        doc.setFontSize(12);
        doc.text(`- ${category.category}:`, 16, y);
        y += 6;
        category.items.slice(0, 5).forEach(item => {
          doc.text(`  • ${item.name}`, 18, y);
          y += 6;
        });
      });
    }
    doc.save(`Event_Plan_${event.eventType}_${event._id}.pdf`);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
        Event Details
      </h1>

      {/* Back Button */}
      <button 
        onClick={() => navigate("/events")} 
        className="text-blue-500 hover:text-blue-700 font-medium mb-6"
      >
        Back to Events
      </button>

      <div className="mb-8 p-4 border rounded-lg bg-gray-50 shadow-sm">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">Event Information</h3>
            <p className="font-medium">Type: {event.eventType}</p>
            <p className="font-medium">Date: {new Date(event.eventDate).toLocaleDateString()}</p>
            <p className="font-medium">Time: {event.eventTime}</p>
            <p className="font-medium">Venue: {event.venue}</p>
            <p className="font-medium">Budget: ${event.budget}</p>
            <p className="font-medium">Description: {event.description}</p>
          </div>
          <button
            onClick={generateAIPlan}
            disabled={isGeneratingPlan}
            className="px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:opacity-90 transition-all disabled:opacity-70"
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
      </div>

      {/* AI Plan Display */}
      {aiPlan && Object.keys(aiPlan.vendorRecommendations).length > 0 && (
        <div className="mt-8 border rounded-lg p-6 bg-white shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">AI-Generated Event Plan</h2>
            <button
              onClick={downloadPlanAsPDF}
              className="px-4 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 ml-4"
            >
              Download Plan as PDF
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

export default EventPlan; 