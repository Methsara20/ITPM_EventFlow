# EventFlow - README

## Introduction
EventFlow is a web-based event management system designed to simplify and optimize event planning processes. Built with the MERN stack, the platform integrates Gemini AI for intelligent decision-making and Google Maps API for location-based services. Key features include automated conflict detection, personalized venue recommendations, and real-time collaboration capabilities.

---

## Features
- **Smart Event Conflict Detector**:
  - Proactively identifies scheduling and resource conflicts.
  - Provides AI-driven suggestions for resolution.

- **Venue Recommendations**:
  - Uses Google Maps API to suggest optimal venues based on user preferences and location accessibility.

- **Budget Optimization**:
  - Assists users in creating and managing budgets for events.

- **Real-Time Collaboration**:
  - Enables multiple stakeholders to collaborate on event planning.

---

## Technology Stack
- **Frontend**: React.js
- **Backend**: Node.js with Express.js
- **Database**: MongoDB (NoSQL)
- **AI Integration**: Gemini AI API
- **Location Services**: Google Maps API (Opensourse)

---

## System Architecture
![Architecture Diagram](architecture-diagram-placeholder.png)

- **Frontend**:
  - Dynamic and interactive user interface built with React.js.
  
- **Backend**:
  - RESTful APIs implemented using Express.js.
  
- **Database**:
  - Scalable storage for event data using MongoDB.
  
- **AI Integration**:
  - Conflict detection and personalized recommendations using Gemini AI.
  
- **Location Services**:
  - Venue and route recommendations with Google Maps API.

---

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Methsara20/ITPM_EventFlow
   cd EventFlow
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   cd client
   npm install
   cd ..
   ```

3. **Set Up Environment Variables**:
   - Create a `.env` file in the root directory with the following variables:
     ```env
     MONGO_URI=<Your MongoDB URI>
     GEMINI_API_KEY=<Your Gemini AI API Key>
     GOOGLE_MAPS_API_KEY=<Your Google Maps API Key>
     ```

4. **Run the Application**:
   - Start the backend server:
     ```bash
     npm run server
     ```
   - Start the frontend client:
     ```bash
     npm run client
     ```
   - Access the application at `http://localhost:3000`

---

## Usage
1. **Sign Up**:
   - Register an account to access the platform.

2. **Create an Event**:
   - Input event details, including dates, venues, and resources.

3. **Utilize Smart Features**:
   - View AI-driven recommendations for venues and schedules.
   - Resolve detected conflicts with suggested solutions.

4. **Collaborate**:
   - Invite team members to collaborate in real-time.

---

## Testing
- **Unit Tests**:
  - Use `Jest` for testing React components and server APIs.

- **API Testing**:
  - Test endpoints using tools like `Postman`.

- **End-to-End Testing**:
  - Use `Cypress` to validate user workflows.

---

## Contributors
- **Methsara**: Event Insights & Optimization, AI Integration
- **Thedas**: Requirement Handling & Assessment
- **Anupama**: Vendor Management
- **Ruvindi**: Finance & Budgeting

---

## Future Enhancements
- Expand conflict detection to include external integrations (e.g., third-party vendor scheduling tools).
- Integrate additional APIs for enhanced personalization.
- Add mobile application support for on-the-go event management.

---

## License
This project is licensed under the MIT License. See the LICENSE file for details.
