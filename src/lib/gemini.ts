import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function enhanceText(text: string, context: string = "professional CV description"): Promise<string> {
  if (!text) return "";
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Improve the following text for a ${context}. Make it professional, concise, and impactful. Use action verbs. 
      Text: "${text}"
      Return only the improved text.`,
    });
    
    return response.text || text;
  } catch (error) {
    console.error("Error enhancing text:", error);
    return text;
  }
}

export async function generateProfessionalSummary(data: any): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional summary for a CV based on the following information:
      Name: ${data.fullName}
      Experience: ${JSON.stringify(data.experience)}
      Education: ${JSON.stringify(data.education)}
      Skills: ${JSON.stringify(data.skills)}
      
      Make it about 3-4 sentences, highlighting key strengths and career goals.
      Return only the summary text.`,
    });
    
    return response.text || "";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "";
  }
}

export async function generateCoverLetter(data: any, jobDescription: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional cover letter based on the following candidate info and job description:
      Candidate: ${JSON.stringify(data)}
      Job Description: ${jobDescription}
      
      The letter should be professional, enthusiastic, and highlight why the candidate is a good fit.
      Return only the cover letter text.`,
    });
    
    return response.text || "";
  } catch (error) {
    console.error("Error generating cover letter:", error);
    return "";
  }
}
