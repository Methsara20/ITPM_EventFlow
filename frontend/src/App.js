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
import AddBudget from "./Components/Budget/AddBudget";
import Budget from "./Components/Budget/Budget";
import UpdateBudget from "./Components/Budget/UpdateBudget";

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
          <Route
            path="/event-plan/:id"
            element={
              <ProtectedRoute>
                <EventPlan />
              </ProtectedRoute>
            }/>
            <Route
              path="/budget"
              element={
                <ProtectedRoute>
                <Budget />
               </ProtectedRoute>
  }
              />
              <Route
                path="/addbudget"
                element={
                  <ProtectedRoute>
                    <AddBudget />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/addbudget/:id"
                element={
                  <ProtectedRoute>
                    <AddBudget />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/update-budget/:id"
                element={
                  <ProtectedRoute>
                    <UpdateBudget />
                  </ProtectedRoute>
                }
              />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
