import { GoogleGenAI } from "@google/genai";
import { IndexFund, InvestmentPlan, UserProfile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const SYSTEM_INSTRUCTION = `
You are "AI Investment Advisor", a friendly financial assistant for low-income users in India (earning ₹10,000–₹20,000/month).
Your goal is to help them grow their money simply using ONLY Index Funds.

Tone:
- Friendly, helpful, beginner-friendly.
- Use simple Hinglish (Hindi + English) like "Agar aap ₹2000 invest karte ho...".
- Avoid technical jargon like "volatility", "beta", "expense ratio" unless you explain them in 1 simple sentence.
- Focus on safety and long-term growth.

Guidelines:
1. Only suggest Index Funds (Nifty 50, Sensex).
2. Explain things in 2-3 lines max.
3. Be encouraging but realistic.
4. If the user asks about stocks or crypto, politely redirect them to index funds as a safer starting point.

When providing recommendations, use this JSON structure if requested:
{
  "recommendations": [
    {
      "name": "Fund Name",
      "description": "Simple description",
      "riskLevel": "Low/Moderate",
      "expectedReturns": "10-12%",
      "benchmark": "Nifty 50",
      "whySuggest": "Simple reason in Hinglish"
    }
  ],
  "plan": {
    "monthlyAmount": 2000,
    "durationMonths": 12,
    "expectedValue": 25000,
    "growthPercentage": 10,
    "summary": "Summary in Hinglish"
  }
}
`;

export async function getChatResponse(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[], userProfile: Partial<UserProfile>) {
  const model = "gemini-3-flash-preview";
  
  const languageInstruction = userProfile.preferredLanguage === 'english' 
    ? "Respond ONLY in English. Keep it simple and professional."
    : "Respond in Hinglish (Hindi + English). Use a friendly, conversational tone.";

  const userContext = userProfile.onboardingCompleted 
    ? `User Profile: Income ₹${userProfile.monthlyIncome}, Expenses ₹${userProfile.monthlyExpenses}, Goal: ${userProfile.investmentGoal}. Language Preference: ${userProfile.preferredLanguage}.`
    : "User has not completed onboarding yet.";

  const response = await ai.models.generateContent({
    model,
    contents: [
      ...history,
      { role: 'user', parts: [{ text: `${userContext}\n\nUser Message: ${message}` }] }
    ],
    config: {
      systemInstruction: `${SYSTEM_INSTRUCTION}\n\n${languageInstruction}`,
      temperature: 0.7,
    },
  });

  return response.text || "Sorry, I couldn't process that. Please try again.";
}

export async function getInvestmentAdvice(userProfile: UserProfile): Promise<{ recommendations: IndexFund[], plan: InvestmentPlan }> {
  const model = "gemini-3-flash-preview";
  
  const languageInstruction = userProfile.preferredLanguage === 'english' 
    ? "Provide all descriptions and summaries ONLY in English."
    : "Provide all descriptions and summaries in Hinglish (Hindi + English).";

  const prompt = `Based on this user profile, provide 2 index fund recommendations and a simple 12-month investment plan.
  Income: ₹${userProfile.monthlyIncome}
  Expenses: ₹${userProfile.monthlyExpenses}
  Savings Capacity: ₹${userProfile.savingsCapacity}
  Goal: ${userProfile.investmentGoal}
  Language Preference: ${userProfile.preferredLanguage}
  
  ${languageInstruction}
  
  Return ONLY a JSON object matching the structure defined in system instructions.`;

  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
    },
  });

  try {
    return JSON.parse(response.text || "{}");
  } catch (e) {
    console.error("Failed to parse AI response", e);
    throw new Error("Could not generate advice. Please try again.");
  }
}
