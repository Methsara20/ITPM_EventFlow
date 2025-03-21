//import logo from './logo.svg';
import React from 'react';
import './styles/Conflicts.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import InsightsForm from './components/EventInsights/InsightsForm';
import InsightsList from './components/EventInsights/InsightsList';
import ConflictDetector from './components/EventInsights/ConflictDetector';



function App() {
  return (
    <div className="App">
      <h1 id="appTitle">Event Insights & Conflict Detection</h1>
      
      <InsightsForm />
      <InsightsList />
      <ConflictDetector />
      
    </div>
  );
}

export default App;
