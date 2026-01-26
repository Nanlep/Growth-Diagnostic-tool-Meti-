import { GoogleGenAI, Type, Schema } from "@google/genai";
import { DiagnosticState, AssessmentResult } from "../types";

// Helper to safely access env vars in various build environments
const getEnvVar = (key: string) => {
  try {
    // @ts-ignore - Vite specific
    if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env[key]) {
      // @ts-ignore
      return import.meta.env[key];
    }
  } catch (e) {}

  try {
    // Node/Webpack specific
    if (typeof process !== 'undefined' && process.env && process.env[key]) {
      return process.env[key];
    }
  } catch (e) {}

  return '';
};

/**
 * PRODUCTION SERVICE (Client-Side)
 * 
 * NOTE: In a strictly server-based architecture, this logic would live on the backend.
 * However, to ensure the application functions immediately in your current environment
 * (Vercel/Netlify/Localhost) without a dedicated backend API deployment, we use the 
 * SDK client-side.
 * 
 * We use 'gemini-3-flash-preview' for high-speed, intelligent business reasoning.
 */
export const analyzeGrowth = async (data: DiagnosticState): Promise<AssessmentResult> => {
  // Try multiple naming conventions for the API Key
  const rawApiKey = getEnvVar('VITE_GOOGLE_API_KEY') || getEnvVar('VITE_API_KEY') || getEnvVar('API_KEY');
  const apiKey = rawApiKey ? rawApiKey.trim() : '';
  
  if (!apiKey) {
    throw new Error("Configuration Error: Google API Key is missing. Please add VITE_GOOGLE_API_KEY to your .env file.");
  }

  // Basic validation to help debug common copy-paste errors
  if (!apiKey.startsWith("AIza")) {
    console.warn("Warning: API Key does not appear to start with 'AIza'. It may be invalid.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Define the strict output schema to ensure the UI never breaks
  const responseSchema: Schema = {
    type: Type.OBJECT,
    properties: {
      overallScore: { type: Type.INTEGER, description: "A score from 0-100 indicating growth maturity" },
      categoryScores: {
        type: Type.OBJECT,
        properties: {
          strategy: { type: Type.INTEGER },
          execution: { type: Type.INTEGER },
          technology: { type: Type.INTEGER },
          team: { type: Type.INTEGER },
        },
        required: ["strategy", "execution", "technology", "team"]
      },
      summary: { type: Type.STRING, description: "A concise executive summary (2-3 sentences)" },
      strengths: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 3 key business strengths identified"
      },
      weaknesses: { 
        type: Type.ARRAY, 
        items: { type: Type.STRING },
        description: "List of 3 critical gaps or weaknesses"
      },
      recommendations: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            impact: { type: Type.STRING, enum: ["High", "Medium", "Low"] }
          },
          required: ["title", "description", "impact"]
        },
        description: "3 specific, actionable recommendations"
      }
    },
    required: ["overallScore", "categoryScores", "summary", "strengths", "weaknesses", "recommendations"]
  };

  try {
    const model = "gemini-3-flash-preview";
    
    const prompt = `
      Act as a Senior Management Consultant (ex-McKinsey/Bain) specializing in SMB and Enterprise growth.
      Analyze the following business diagnostic data and provide a rigorous maturity assessment.

      BUSINESS PROFILE:
      - Company Name: ${data.companyName}
      - Industry: ${data.industry}
      - Business Model: ${data.businessModel}
      - Annual Revenue: ${data.annualRevenue}
      - Employees: ${data.employeeCount}
      
      GOALS & CHALLENGES:
      - Primary Goal: ${data.primaryGoal}
      - Biggest Challenge: ${data.biggestChallenge}
      - Marketing Channel: ${data.marketingChannel}
      
      ECONOMICS & OPS:
      - CAC: ${data.cac}
      - LTV: ${data.ltv}
      - Payback Period: ${data.paybackPeriod}
      - Sales Cycle: ${data.salesCycleLength}
      - Tech Stack Maturity: ${data.techStackRating}/10
      - Customer Retention: ${data.customerRetention}/10

      INSTRUCTIONS:
      1. Calculate a realistic 'overallScore' (0-100) based on the balance of revenue, unit economics (LTV:CAC), and operational maturity.
      2. Provide category scores for Strategy, Execution, Technology, and Team.
      3. Identify 3 specific strengths and 3 critical weaknesses based on the provided metrics.
      4. Generate 3 actionable, high-impact recommendations to solve their specific '${data.biggestChallenge}' and achieve '${data.primaryGoal}'.
      
      Be critical but constructive. Do not use generic platitudes. Use the JSON format provided.
    `;

    const response = await ai.models.generateContent({
      model: model,
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, // Lower temperature for more consistent, analytical results
      }
    });

    if (!response.text) {
      throw new Error("AI returned an empty response. Please try again.");
    }

    const result = JSON.parse(response.text);
    return result as AssessmentResult;

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    
    let message = error.message || "An unexpected error occurred.";

    // Attempt to parse if it's a JSON string (common with some Google API client errors)
    try {
      if (typeof message === 'string' && message.trim().startsWith('{')) {
        const parsed = JSON.parse(message);
        if (parsed.error && parsed.error.message) {
          message = parsed.error.message;
        }
      }
    } catch (e) {
      // ignore parsing error, use original message
    }

    // Friendly error mapping
    if (message.includes("API key not valid") || message.includes("API_KEY_INVALID")) {
      throw new Error("Invalid Google API Key. Please check the VITE_GOOGLE_API_KEY environment variable in your .env file.");
    }

    if (message.includes("429") || message.toLowerCase().includes("quota")) {
      throw new Error("We are experiencing high traffic. Please wait a moment and try again.");
    }

    throw new Error(message || "Failed to generate analysis. Please check your connection.");
  }
};