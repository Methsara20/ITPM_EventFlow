import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "../NavBar/Navbar";

// Import images from the assets folder
import image1 from "../assets/images/bg1.jpg";
import image2 from "../assets/images/bg2.jpg";
import image3 from "../assets/images/bg3.jpg";
import image4 from "../assets/images/bg4.jpg";

function Home() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [image1, image2, image3, image4]; // Array of imported images

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval); // Cleanup on component unmount
  }, [images.length]);

  return (
    <div>
      <Navbar />
      <div className="bg-light">
        {/* Hero Section */}
        <div
          className="d-flex flex-column justify-content-center align-items-center p-3 p-md-5 text-center position-relative"
          style={{
            backgroundImage: `url(${images[currentImageIndex]})`,
            backgroundSize: "cover", // Keeps the image proportionate
            backgroundPosition: "center",
            height: "50vh", // Adjusted height to 80% of the viewport height
            transition: "background-image 2s ease-in-out",
          }}
        >
          {/* Darker Overlay */}
          <div
            className="position-absolute top-0 start-0 w-100 h-100"
            style={{
              backgroundColor: "rgba(0, 0, 0, 0.7)", // Darker overlay
              zIndex: 1,
            }}
          ></div>

          {/* Content */}
          <div style={{ zIndex: 2 }}>
            <h1 className="fw-bold display-4 display-md-1 mb-3 mb-md-4 text-white">
              <span className="text-primary">Plan Perfect Events</span>
              <br className="d-none d-md-block" />
              With AI-Powered Management
            </h1>

            <p
              className="fs-5 text-white mb-4 mb-md-5 mx-auto"
              style={{ maxWidth: "800px" }}
            >
              Streamline your event planning process with our intelligent
              platform that handles venues, vendors, and logistics tailored to
              your needs.
            </p>

            {/* Centered Buttons */}
            <div className="d-flex justify-content-center gap-3">
              <Link
                to="/selectevent"
                className="btn btn-primary btn-lg px-4 py-2 fs-4"
              >
                Create Event
              </Link>
              <Link
                to="/events"
                className="btn btn-outline-light btn-lg px-4 py-2 fs-4"
              >
                Browse Events
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="container py-5 my-5">
          <h2 className="text-center mb-5 fw-bold">Why Choose Our Platform?</h2>

          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-primary bg-opacity-10 rounded-circle d-inline-flex justify-content-center align-items-center p-3 mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    📅
                  </div>
                  <h3 className="h4">Smart Scheduling</h3>
                  <p className="text-muted">
                    AI-powered date recommendations and conflict detection for
                    flawless planning.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-primary bg-opacity-10 rounded-circle d-inline-flex justify-content-center align-items-center p-3 mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    🤝
                  </div>
                  <h3 className="h4">Vendor Network</h3>
                  <p className="text-muted">
                    Access our curated network of trusted caterers, venues, and
                    service providers.
                  </p>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="card h-100 border-0 shadow-sm">
                <div className="card-body text-center p-4">
                  <div
                    className="bg-primary bg-opacity-10 rounded-circle d-inline-flex justify-content-center align-items-center p-3 mb-3"
                    style={{ width: "60px", height: "60px" }}
                  >
                    💰
                  </div>
                  <h3 className="h4">Budget Tools</h3>
                  <p className="text-muted">
                    Real-time cost tracking and optimization suggestions to
                    maximize your budget.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-primary text-white py-5">
          <div className="container text-center py-5">
            <h2 className="display-5 fw-bold mb-4">
              Ready to Transform Your Event Planning?
            </h2>
            <p className="fs-5 mb-5 opacity-75">
              Join thousands of event professionals who trust our platform for
              their most important occasions.
            </p>
            <Link
              to="/selectevent"
              className="btn btn-light btn-lg px-5 py-3 fs-4 fw-bold"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
