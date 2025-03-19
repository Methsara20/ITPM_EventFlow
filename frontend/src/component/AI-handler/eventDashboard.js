import React from "react";
import {Navbar} from "../Navbar";
//import {Footer} from "../fotter";

const EventDashboard = () => {
  return (
    <div className="bg-light min-vh-100 d-flex flex-column">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="container my-4 flex-grow-1">
        {/* Header */}
        <header className="d-flex justify-content-between align-items-center mb-4">
          <h1 className="h3">Event Overview</h1>
          <button className="btn btn-primary">New Event</button>
        </header>

        {/* Event Details */}
        <section className="mb-4">
          <h2 className="h5">Annual Company Conference</h2>
          <p className="text-muted">Oct 15-17, 2023 • 250 Guests • $75,000 Budget</p>
        </section>

        {/* Key Metrics */}
        <section className="row mb-4">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-header">Budget Usage</div>
              <div className="card-body">
                <p>78%</p>
                <p>$58,500 of $75,000 allocated</p>
                <button className="btn btn-outline-primary">View Details</button>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-header">Guest Satisfaction</div>
              <div className="card-body">
                <p>92%</p>
                <p>Based on 150 responses</p>
                <button className="btn btn-outline-primary">See Feedback</button>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-header">Cost Savings</div>
              <div className="card-body">
                <p>$12,450</p>
                <p>16.6% below initial estimate</p>
                <button className="btn btn-outline-primary">View Breakdown</button>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="mb-4">
          <h3 className="h5">Timeline</h3>
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Phase</th>
                <th>Dates</th>
                <th>Status</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Planning Phase</td>
                <td>Aug 15 - Sep 10</td>
                <td>Completed</td>
                <td>25 days</td>
              </tr>
              <tr>
                <td>Vendor Selection</td>
                <td>Sep 11 - Sep 30</td>
                <td>Completed</td>
                <td>20 days</td>
              </tr>
              <tr>
                <td>Final Preparations</td>
                <td>Oct 1 - Oct 14</td>
                <td>In Progress</td>
                <td>14 days</td>
              </tr>
              <tr>
                <td>Event Execution</td>
                <td>Oct 15 - Oct 17</td>
                <td>Upcoming</td>
                <td>3 days</td>
              </tr>
            </tbody>
          </table>
        </section>

        {/* AI Suggestions */}
        <section className="mb-4">
          <h3 className="h5">AI Suggestions</h3>
          <div className="row mt-3">
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-header">Change Venue</div>
                <div className="card-body">
                  <p>Current venue costs 20% above market rate. 3 alternatives available.</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary">View Options</button>
                    <button className="btn btn-outline-secondary">Dismiss</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-header">Adjust Timeline</div>
                <div className="card-body">
                  <p>Shorten setup time by 2 hours to reduce labor costs.</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary">Apply Change</button>
                    <button className="btn btn-outline-secondary">Dismiss</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card">
                <div className="card-header">Menu Optimization</div>
                <div className="card-body">
                  <p>Switch to seasonal menu items to save 15% on catering.</p>
                  <div className="d-flex gap-2">
                    <button className="btn btn-outline-primary">See Menu</button>
                    <button className="btn btn-outline-secondary">Dismiss</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Budget Breakdown */}
        <section>
          <h3 className="h5">Budget Breakdown</h3>
          <div className="bg-secondary text-white text-center py-5 mt-3">
            <p>[Chart: Budget allocation pie chart]</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default EventDashboard;
