import React from "react";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="bg-light">
      {/* Hero Section */}
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 p-3 p-md-5 text-center bg-white">
        <h1 className="fw-bold display-4 display-md-1 mb-3 mb-md-4">
          <span className="text-primary">Plan Perfect Events</span>
          <br className="d-none d-md-block" />
          With AI-Powered Management
        </h1>
        
        <p className="fs-5 text-muted mb-4 mb-md-5 mx-auto" style={{ maxWidth: "800px" }}>
          Streamline your event planning process with our intelligent platform that handles
          venues, vendors, and logistics tailored to your needs.
        </p>

        <div className="d-flex gap-3">
          <Link to="/selectevent" className="btn btn-primary btn-lg px-4 py-2 fs-4">
            Create Event
          </Link>
          <Link to="/events" className="btn btn-outline-secondary btn-lg px-4 py-2 fs-4">
            Browse Events
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="container py-5 my-5">
        <h2 className="text-center mb-5 fw-bold">Why Choose Our Platform?</h2>
        
        <div className="row g-4">
          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                  <i className="bi bi-calendar-check fs-1 text-primary"></i>
                </div>
                <h3 className="h4">Smart Scheduling</h3>
                <p className="text-muted">
                  AI-powered date recommendations and conflict detection for flawless planning.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                  <i className="bi bi-people fs-1 text-primary"></i>
                </div>
                <h3 className="h4">Vendor Network</h3>
                <p className="text-muted">
                  Access our curated network of trusted caterers, venues, and service providers.
                </p>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center p-4">
                <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex p-3 mb-3">
                  <i className="bi bi-graph-up fs-1 text-primary"></i>
                </div>
                <h3 className="h4">Budget Tools</h3>
                <p className="text-muted">
                  Real-time cost tracking and optimization suggestions to maximize your budget.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-white py-5">
        <div className="container text-center py-5">
          <h2 className="display-5 fw-bold mb-4">Ready to Transform Your Event Planning?</h2>
          <p className="fs-5 mb-5 opacity-75">
            Join thousands of event professionals who trust our platform for their most important occasions.
          </p>
          <Link to="/signup" className="btn btn-light btn-lg px-5 py-3 fs-4 fw-bold">
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;