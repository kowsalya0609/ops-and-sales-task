
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  // In a real app, you'd handle this more gracefully.
  // For this environment, we assume API_KEY is set.
  console.warn("API_KEY environment variable not set.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const personalizeText = async (text: string, userName: string): Promise<string> => {
  const prompt = `
    You are an expert assistant for professional communication.
    Your task is to rewrite the following text.
    You must replace any instance of "[Your Name]" with "${userName}".
    Maintain the original tone, structure, and formatting (including line breaks) of the text.
    Only output the rewritten text, with no additional commentary or explanations.

    Original Text:
    ---
    ${text}
    ---
    `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to personalize text due to an API error.");
  }
};
