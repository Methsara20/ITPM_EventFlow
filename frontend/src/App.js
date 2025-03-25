import React from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./Components/intput.css";  

import Ted from "./Components/Event/Ted"; // Import the Teds component
import EventsList from "./Components/Event/Eventslist"; // Import the EventsList component
import UpdateEvent from "./Components/Event/UpdateEvent";
function App() {
  return (
    <Router>
      <div className='container'>
        <br/>
        <Routes>
          <Route path="/ted" element={<Ted />} />
          <Route path="/events" element={<EventsList />} />
          <Route path="/update-event/:id" element={<UpdateEvent />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
