
import { GoogleGenAI } from "@google/genai";
import { MSBTE_SYSTEM_PROMPT } from "../constants";
import { MessageAttachment } from "../types";

const getAIClient = () => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is configured.");
  }
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

/**
 * Generates a streaming AI response using the Gemini API.
 * Yields text chunks as they are received from the model.
 */
export const generateAIResponse = async function* (prompt: string, context: string = "", attachment?: MessageAttachment) {
  try {
    const ai = getAIClient();
    const model = 'gemini-3-flash-preview';
    
    const parts: any[] = [{ text: `${context}\n\nUser Query: ${prompt}` }];

    if (attachment) {
      const mimeType = attachment.url.split(';')[0].split(':')[1] || 'application/octet-stream';
      const base64Data = attachment.url.split(',')[1];

      if (mimeType.startsWith('image/') || mimeType === 'application/pdf') {
        parts.unshift({ 
          inlineData: { 
            mimeType: mimeType, 
            data: base64Data 
          } 
        });
      } else if (mimeType.startsWith('text/')) {
        try {
          const decodedText = atob(base64Data);
          parts.push({ text: `\n\n[Attached Document Context - ${attachment.name}]:\n${decodedText}` });
        } catch (e) {
          console.warn("Failed to decode text attachment", e);
        }
      } else {
        parts.push({ text: `\n\n[System Note: User has attached a file named "${attachment.name}" of type ${mimeType}.]` });
      }
    }

    const stream = await ai.models.generateContentStream({
      model,
      contents: { parts },
      config: {
        systemInstruction: MSBTE_SYSTEM_PROMPT,
        temperature: 0.7,
      },
    });

    for await (const chunk of stream) {
      const chunkText = chunk.text;
      if (chunkText) {
        yield chunkText;
      }
    }
  } catch (error: any) {
    console.error("Gemini Streaming Error:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      yield "Error: Invalid API Key. Please verify your credentials.";
    } else {
      yield "Error: Protocol failure during neural stream synthesis. Connection interrupted.";
    }
  }
};
