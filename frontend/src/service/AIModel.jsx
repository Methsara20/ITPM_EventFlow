import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
  } from "@google/generative-ai";
  
  // Configuration Constants
  const DEFAULT_TIMEOUT = 15000; // 15 seconds
  const FALLBACK_MODEL = "gemini-pro";
  
  // Initialize API with environment variable
  const apiKey = process.env.REACT_APP_GOOGLE_GEMINI_AI_API_KEY;
  
  if (!apiKey) {
    throw new Error(`
      Google Gemini API key is missing!
      Please verify:
      1. Your .env file contains REACT_APP_GOOGLE_GEMINI_AI_API_KEY
      2. The server has been restarted after adding the variable
      3. The variable name is spelled correctly
    `);
  }
  
  const genAI = new GoogleGenerativeAI(apiKey);
  
  // Safety Configuration
  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ];
  
  // Generation Configuration
  const generationConfig = {
    temperature: 0.9,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
  };
  
  /**
   * Extracts JSON from potentially markdown-wrapped response
   */
  const extractJSON = (text) => {
    try {
      // Case 1: Response is already pure JSON
      const parsed = JSON.parse(text);
      if (parsed && typeof parsed === 'object') return parsed;
    } catch (e) {
      // Case 2: JSON wrapped in markdown or other text
      const jsonStart = text.indexOf('{');
      const jsonEnd = text.lastIndexOf('}') + 1;
      if (jsonStart >= 0 && jsonEnd > jsonStart) {
        try {
          return JSON.parse(text.slice(jsonStart, jsonEnd));
        } catch (parseError) {
          console.warn("Partial JSON extraction failed:", parseError);
        }
      }
    }
    
    // Case 3: Return as text if JSON parsing fails
    return { error: "Invalid JSON response", rawText: text };
  };
  
  /**
   * Generates content with timeout and retry logic
   */
  export const generateContent = async (prompt, options = {}) => {
    const {
      timeout = DEFAULT_TIMEOUT,
      retries = 2,
      modelName = "gemini-2.0-flash"
    } = options;
  
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
  
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        safetySettings,
        generationConfig,
      });
  
      let lastError;
      
      for (let attempt = 0; attempt <= retries; attempt++) {
        try {
          const result = await model.generateContent(prompt, {
            signal: controller.signal,
          });
          
          clearTimeout(timeoutId);
          const response = await result.response;
          const text = response.text();
          
          const parsedResponse = extractJSON(text);
          
          if (parsedResponse.error) {
            throw new Error(`API returned invalid JSON: ${parsedResponse.rawText}`);
          }
          
          return parsedResponse;
        } catch (error) {
          lastError = error;
          if (attempt < retries) {
            await new Promise(resolve => 
              setTimeout(resolve, 1000 * (attempt + 1))
            );
          }
        }
      }
      
      throw lastError || new Error("Unknown error occurred");
    } catch (error) {
      clearTimeout(timeoutId);
      
      const errorInfo = {
        name: error.name,
        message: error.message,
        stack: error.stack,
        type: "API_ERROR",
      };
      
      console.error("AI Generation Failed:", errorInfo);
      
      if (error.name === 'AbortError') {
        throw new Error(`Request timed out after ${timeout}ms`);
      }
      
      throw new Error(`Generation failed: ${error.message}`);
    }
  };
  
  // Fallback response generator
  export const getFallbackResponse = () => ({
    eventOverview: {
      type: "fallback",
      date: new Date().toISOString(),
      time: "00:00",
      venue: "Unknown",
      budget: "0",
    },
    vendors: [],
    timeline: [],
    checklist: []
  });
  
  export default {
    generateContent,
    getFallbackResponse,
  };