import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/Components/intput.css"; // Fixed path

// Event-related components
import VenueSelection from "../src/Components/locations/VenueSelection";
import Hero from "../src/Components/custom/Hero";
import Ted from "../src/Components/Event/Ted";
import EventsList from "../src/Components/Event/Eventslist";
import UpdateEvent from "../src/Components/Event/UpdateEvent";
import EventPlan from "./Components/Event/EventPlan";

// Vendor-related components
import Vendor from "./Components/vendor/vendor";
import VendorsList from "./Components/vendor/VendorList";
import UpdateVendor from "./Components/vendor/updateVendor";

import Budget from "./Components/Budget/Budget";
import AddBudget from "./Components/Budget/AddBudget";
import UpdateBudget from "./Components/Budget/UpdateBudget";

// Auth & Routing
import Login from "../src/Components/Login";
import ProtectedRoute from "../src/Components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="container">
        <br />
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protected Home Route */}
          <Route path="/" element={
            <ProtectedRoute>
              <Hero />
            </ProtectedRoute>
          } />

          {/* Event Routes */}
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

          {/* Vendor Routes */}
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
          <Route path="/budget" element={<Budget />} />
        <Route path="/addbudget" element={<AddBudget />} />
        <Route path="/addbudget/:id" element={<AddBudget />} />
        <Route path="/update-budget/:id" element={<UpdateBudget />} /> 
        
        </Routes>
      </div>
    </Router>
  );
}

export default App;
