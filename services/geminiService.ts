import { GoogleGenAI, Type } from "@google/genai";
import { ScanResult } from "../types";

// This is a placeholder. In a real app, you might want to proxy this or require user input.
// For this demo, we assume the user might provide one via Settings or we use env if available.
let API_KEY = process.env.API_KEY || '';

export const setApiKey = (key: string) => {
  API_KEY = key;
};

export const hasApiKey = () => !!API_KEY;

const SYSTEM_INSTRUCTION = `
You are an expert industrial engineer and DIY craftsman. 
Your goal is to analyze an image of an object, identify it, explain how it is industrially manufactured, 
and then teach a beginner how to make a functional replica or similar item using simple DIY tools and materials.
Keep descriptions concise, encouraging, and easy to understand.
`;

export const analyzeImage = async (base64Image: string): Promise<ScanResult> => {
  if (!API_KEY) {
    throw new Error("API Key is missing. Please set it in Settings.");
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const responseSchema = {
    type: Type.OBJECT,
    properties: {
      objectName: { type: Type.STRING, description: "The name of the identified object" },
      confidence: { type: Type.NUMBER, description: "Confidence score between 0 and 100" },
      shortDescription: { type: Type.STRING, description: "A one sentence description of what the object is." },
      materials: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            description: { type: Type.STRING },
          }
        }
      },
      manufacturingProcess: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            stepNumber: { type: Type.INTEGER },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
          }
        }
      },
      diyGuide: {
        type: Type.OBJECT,
        properties: {
          difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
          estimatedTime: { type: Type.STRING },
          toolsRequired: { type: Type.ARRAY, items: { type: Type.STRING } },
          materialsNeeded: { type: Type.ARRAY, items: { type: Type.STRING } },
          safetyNotes: { type: Type.ARRAY, items: { type: Type.STRING } },
          steps: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                stepNumber: { type: Type.INTEGER },
                instruction: { type: Type.STRING },
                tip: { type: Type.STRING },
              }
            }
          }
        }
      }
    },
    required: ["objectName", "confidence", "materials", "manufacturingProcess", "diyGuide"]
  };

  try {
    // Strip header if present (data:image/jpeg;base64,)
    const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64
            }
          },
          {
            text: "Analyze this object. Identify it, explain industrial manufacturing, and provide a DIY guide."
          }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const data = JSON.parse(text);

    return {
      id: Date.now().toString(),
      timestamp: Date.now(),
      imageUrl: base64Image,
      ...data
    };
  } catch (error) {
    console.error("Gemini analysis failed:", error);
    throw error;
  }
};