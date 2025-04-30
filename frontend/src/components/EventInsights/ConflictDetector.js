import React, { useState } from 'react';
import axios from 'axios';

function ConflictDetector() {
  const [eventId, setEventId] = useState('');
  const [conflictDetails, setConflictDetails] = useState('');

  const handleConflictCheck = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/conflicts/detect', { eventId });
      setConflictDetails(response.data.details);
    } catch (error) {
      console.error(error);
      alert('Failed to Detect Conflict');
    }
  };

  return (
    <div id="conflictDetector">
      <h2 id="detectorTitle">Conflict Detector</h2>
      <input
        type="text"
        placeholder="Enter Event ID"
        value={eventId}
        onChange={(e) => setEventId(e.target.value)}
        id="eventIdInput"
      />
      <button onClick={handleConflictCheck} id="checkButton">Check Conflict</button>
      {conflictDetails && (
        <p id="conflictDetails">Conflict Details: {conflictDetails}</p>
      )}
    </div>
  );
}

export default ConflictDetector;
