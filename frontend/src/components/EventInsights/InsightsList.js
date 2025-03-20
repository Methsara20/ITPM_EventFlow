import React, { useEffect, useState } from 'react';
import axios from 'axios';

function InsightsList() {
  const [insights, setInsights] = useState([]);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/insights');
        setInsights(response.data);
      } catch (error) {
        console.error(error);
        alert('Failed to Fetch Insights');
      }
    };
    fetchInsights();
  }, []);

  return (
    <div id="insightsList">
      <h2 id="listTitle">Event Insights</h2>
      <ul id="insightsUl">
        {insights.map((insight) => (
          <li key={insight._id} id="insightItem">
            <h3>{insight.eventName}</h3>
            <p>Date: {new Date(insight.eventDate).toLocaleDateString()}</p>
            <p>Venue: {insight.venue}</p>
            <p>Budget: ${insight.budget}</p>
            <p>Attendees: {insight.attendees}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default InsightsList;
