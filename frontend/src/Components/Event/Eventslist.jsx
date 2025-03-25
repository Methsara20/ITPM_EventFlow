import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import 'bootstrap/dist/css/bootstrap.min.css';
import { IoSearch } from "react-icons/io5";
import { FiPrinter } from "react-icons/fi";

const EventsList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/events")
      .then((response) => {
        setEvents(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/events/${id}`);
      setEvents(events.filter((event) => event._id !== id));
    } catch (err) {
      alert("Error deleting event: " + err.message);
    }
  };

  const handleUpdate = (id) => {
    navigate(`/update-event/${id}`);
  };

  //Report genaration
const generateReport = () => {
  if (!events || events.length === 0) {
    alert("No data available to generate the report.");
    return;
  }

  // Use filteredEvents instead of all events
  const filteredEvents = events.filter((event) =>
    event.eventType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filteredEvents.length === 0) {
    alert("No events found matching the search term.");
    return;
  }

  const doc = new jsPDF();

  // Set title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  
  // Calculate the width of the text
const title = "EventFlow Report";
const titleWidth = doc.getTextWidth(title);

// Calculate the x position to center the text
const x = (doc.internal.pageSize.width - titleWidth) / 2;

// Set y position (you can adjust it to your preference)
const y = 20;

// Add centered title
doc.text(title, x, y);

  // Define table headers
  const tableHeaders = [["Event Type", "Venue", "Budget", "Event Date"]];

  // Define table data for filtered events
  const tableData = filteredEvents.map(event => [
    event.eventType,
    event.venue,
    `$${event.budget.toFixed(2)}`, // Ensure budget is formatted correctly
    new Date(event.eventDate).toLocaleDateString() // Format date properly
  ]);

  // Add table using autoTable
  autoTable(doc, {
    startY: 30,
    head: tableHeaders,
    body: tableData,
    theme: "grid",
    styles: { fontSize: 12, cellPadding: 5 },
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });

  // Save PDF
  doc.save("Event_Report.pdf");
};


  //search
  const filteredEvents = events.filter((event) =>
    event.eventType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p className="text-center mt-4">Loading events...</p>;
  if (error) return <p className="text-danger text-center mt-4">Error: {error}</p>;

  return (
    <div className="container mt-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 class="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-violet-500">Events List</h2>
        <div className="input-group w-25">
          <span className="input-group-text">
            <IoSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search events"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button onClick={generateReport} className="btn btn-success">
          <FiPrinter className="me-2" /> Generate Report
        </button>
      </div>
      {filteredEvents.map((event) => (
        <div key={event._id} className="card mb-3 shadow-sm">
          <div className="card-body d-flex justify-content-between align-items-center">
            <div>
              <h5 className="card-title">{event.eventType}</h5>
              <p className="card-text">Venue: {event.venue}</p>
              <p className="card-text">Budget: ${event.budget}</p>
              <p className="text-muted">
                {new Date(event.eventDate).toLocaleString()}
              </p>
            </div>
            <div>
              <button
                onClick={() => handleUpdate(event._id)}
                className="btn btn-primary me-2"
              >
                Update
              </button>
              <button
                onClick={() => handleDelete(event._id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default EventsList;
