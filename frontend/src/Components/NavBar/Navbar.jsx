import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";

export const Navbar = () => {
  return (
    <nav className="navbar navbar-expand navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          EventFlow
        </a>
        
        {/* Navigation items styled as buttons */}
        <ul className="navbar-nav me-auto">
          <li className="nav-item">
            <a className="btn btn-outline-light mx-1" href="#">
              Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a className="btn btn-outline-light mx-1" href="/events">
              Events
            </a>
          </li>
          <li className="nav-item">
            <a className="btn btn-outline-light mx-1" href="#">
              Analytics
            </a>
          </li>
          <li className="nav-item">
            <a className="btn btn-outline-light mx-1" href="#">
              Settings
            </a>
          </li>
        </ul>
        
        {/* Help button */}
        <div className="d-flex">
          <button className="btn btn-outline-light">
            Help
          </button>
        </div>
      </div>
    </nav>
  );
};