import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components/intput.css"; // Fixed path
import VenueSelection  from "../src/components/locations/VenueSelection"
import Hero from "../src/components/custom/Hero";
import Ted from "./components/Event/Ted";
import EventsList from "./components/Event/Eventslist";
import UpdateEvent from "./components/Event/UpdateEvent";

function App() {
  return (
    <Router>
      <div className="container">
        <br />
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/selectevent" element={<VenueSelection />} />
          <Route path="/ted" element={<Ted />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/update-event/:id" element={<UpdateEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
