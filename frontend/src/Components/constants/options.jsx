export const EventTypeOptions = [
    {
      id: 1,
      title: "Wedding",
      desc: "Celebrate your special day",
      icon: "💍",
      value: "wedding"
    },
    {
      id: 2,
      title: "Corporate Event",
      desc: "Business meetings or company gatherings",
      icon: "💼",
      value: "corporate"
    },
    {
      id: 3,
      title: "Birthday Party",
      desc: "Celebrate someone's special day",
      icon: "🎂",
      value: "birthday"
    },
    {
      id: 4,
      title: "Conference",
      desc: "Professional gathering with speakers",
      icon: "🎤",
      value: "conference"
    },
    {
      id: 5,
      title: "Other",
      desc: "Any other type of event",
      icon: "🎉",
      value: "other"
    }
  ];
  
  export const EventBudgetOptions = [
    {
      id: 1,
      title: "Low Budget",
      desc: "Under $1,000",
      icon: "💰",
      value: 500
    },
    {
      id: 2,
      title: "Medium Budget",
      desc: "$1,000 - $5,000",
      icon: "💵",
      value: 2500
    },
    {
      id: 3,
      title: "High Budget",
      desc: "Over $5,000",
      icon: "💎",
      value: 7500
    }
  ];
  
  export const EventTimeOptions = [
    {
      id: 1,
      title: "Morning",
      desc: "8:00 AM - 11:59 AM",
      icon: "🌅",
      value: "morning"
    },
    {
      id: 2,
      title: "Afternoon",
      desc: "12:00 PM - 4:59 PM",
      icon: "🌞",
      value: "afternoon"
    },
    {
      id: 3,
      title: "Evening",
      desc: "5:00 PM - 8:59 PM",
      icon: "🌆",
      value: "evening"
    },
    {
      id: 4,
      title: "Night",
      desc: "9:00 PM - 11:59 PM",
      icon: "🌃",
      value: "night"
    }
  ];
  
  export const EVENT_AI_PROMPT = `
As an expert event planner, generate a comprehensive plan for a {eventType} event at {venue} on {eventDate} at {eventTime} with a budget of {budget}. 

Provide detailed recommendations in this EXACT JSON format:

{
  "eventOverview": {
    "type": "{eventType}",
    "date": "{eventDate}",
    "time": "{eventTime}",
    "venue": "{venue}",
    "budget": "{budget}",
    "totalGuests": "50-100" // Adjust based on event type
  },
  "vendorRecommendations": {
    "catering": [
      {
        "companyName": "String",
        "serviceDescription": "String",
        "menuOptions": ["Array", "of", "options"],
        "priceRange": "$X,XXX-XX,XXX",
        "contact": {
          "phone": "String",
          "email": "String",
          "website": "URL"
        },
        "rating": "X.X/5",
        "notes": "String"
      }
    ],
    "decor": [
      {
        "companyName": "String",
        "specialties": ["Array", "of", "specialties"],
        "priceRange": "$X,XXX-XX,XXX",
        "contact": {
          "phone": "String",
          "email": "String"
        },
        "rating": "X.X/5",
        "portfolioUrl": "URL"
      }
    ],
    "entertainment": [
      {
        "type": "String (e.g., DJ, Band)",
        "name": "String",
        "repertoire": ["Array", "of", "samples"],
        "priceRange": "$X,XXX-XX,XXX",
        "contact": {
          "phone": "String",
          "email": "String"
        },
        "rating": "X.X/5"
      }
    ]
  },
  "eventTimeline": [
    {
      "time": "HH:MM AM/PM - HH:MM AM/PM",
      "activity": "String",
      "responsibleParty": "String",
      "resourcesNeeded": ["Array", "of", "items"],
      "notes": "String"
    }
  ],
  "floorPlan": {
    "layoutUrl": "URL to diagram/image",
    "zones": [
      {
        "name": "String (e.g., Reception Area)",
        "dimensions": "X sq ft",
        "purpose": "String",
        "itemsNeeded": ["Array", "of", "items"]
      }
    ],
    "trafficFlow": "Description"
  },
  "checklist": [
    {
      "category": "String (e.g., Catering)",
      "items": [
        {
          "name": "String",
          "status": "Not Started/In Progress/Completed",
          "dueDate": "YYYY-MM-DD",
          "assignedTo": "String"
        }
      ]
    }
  ],
  "budgetBreakdown": {
    "totalBudget": "{budget}",
    "allocations": [
      {
        "category": "String",
        "amount": "$X,XXX",
        "percentage": "XX%"
      }
    ]
  }
}

IMPORTANT:
1. Include 3-5 options for each vendor category
2. Timeline should cover setup, main event, and teardown
3. Floor plan should be venue-specific
4. Checklist should be comprehensive and categorized
5. All monetary values should match the {budget} parameter
6. Include realistic contact information for local vendors
`;