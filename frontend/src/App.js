import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/Components/intput.css"; // Fixed path
import VenueSelection  from "../src/Components/locations/VenueSelection"
import Hero from "../src/Components/custom/Hero";
import Ted from "../src/Components/Event/Ted";
import EventsList from "../src/Components/Event/Eventslist";
import UpdateEvent from "../src/Components/Event/UpdateEvent";
import Login from "../src/Components/Login";
import ProtectedRoute from "../src/Components/ProtectedRoute";
import EventPlan from "./Components/Event/EventPlan";

import Vendor from "./Components/vendor/vendor"; // Corrected import name
import VendorsList from "./Components/vendor/VendorList"; // Import the VendorsList component
import UpdateVendor from "./Components/vendor/updateVendor"; // Adjust the path if needed
function App() {
  return (
    <Router>
      <div className="container">
        <br />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Hero />
            </ProtectedRoute>
          } />
          <Route path="/selectevent" element={
            <ProtectedRoute>
              <VenueSelection />
            </ProtectedRoute>
          } />
          <Route path="/ted" element={
            <ProtectedRoute>
              <Ted />
            </ProtectedRoute>
          } />
          <Route path="/events" element={
            <ProtectedRoute>
              <EventsList />
            </ProtectedRoute>
          } />
          <Route path="/update-event/:id" element={
            <ProtectedRoute>
              <UpdateEvent />
            </ProtectedRoute>
          } />
          <Route path="/event-plan/:id" element={
            <ProtectedRoute>
              <EventPlan />
            </ProtectedRoute>
          } />
          
          {/* ✅ Vendor Routes */}
          <Route path="/vendor" element={
            <ProtectedRoute>
              <Vendor />
            </ProtectedRoute>
          } />
          <Route path="/vendors" element={
            <ProtectedRoute>
              <VendorsList />
            </ProtectedRoute>
          } />
          <Route path="/update-vendor/:id" element={
            <ProtectedRoute>
              <UpdateVendor />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}


export default App;
