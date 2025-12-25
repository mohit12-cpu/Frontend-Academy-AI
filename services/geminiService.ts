
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { QuizQuestion, Flashcard, GroundingResource } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getExplanation(topic: string, level: string = 'Beginner'): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Explain the frontend concept of "${topic}" for a ${level} learner. Use simple analogies and highlight why it's important. 
        Format with bold text (**term**) for key keywords.`,
      });
      return response.text || "I'm sorry, I couldn't generate an explanation at this moment.";
    } catch (error) {
      console.error("Gemini Explanation Error:", error);
      return "An error occurred while fetching the explanation.";
    }
  }

  async getLatestResources(topic: string): Promise<{ text: string, links: GroundingResource[] }> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Search for the latest best practices, MDN documentation, and trending articles for "${topic}" in 2025. 
        Provide a concise 2-3 paragraph summary of current trends and return 4 high-quality relevant links.
        Use bold text (**term**) for major tech shifts.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });
      
      const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const links: GroundingResource[] = [];
      const seenUris = new Set<string>();

      groundingChunks.forEach((chunk: any) => {
        if (chunk.web?.uri && !seenUris.has(chunk.web.uri)) {
          links.push({
            title: chunk.web.title || 'Official Resource',
            uri: chunk.web.uri
          });
          seenUris.add(chunk.web.uri);
        }
      });

      return {
        text: response.text || "No trending info found.",
        links: links.slice(0, 4)
      };
    } catch (error) {
      console.error("Grounding error:", error);
      return { text: "Unable to reach search engine.", links: [] };
    }
  }

  async generateQuiz(topic: string): Promise<QuizQuestion[]> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 3 high-quality multiple-choice questions about "${topic}". Ensure the explanation is detailed and supportive. Output in JSON.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                correctAnswer: { type: Type.INTEGER, description: "Index of the correct option (0-indexed)" },
                explanation: { type: Type.STRING }
              },
              required: ["question", "options", "correctAnswer", "explanation"]
            }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      return [];
    }
  }

  async generateFlashcards(topic: string): Promise<Flashcard[]> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate 5 key term flashcards for "${topic}". Definitions should be clear and concise. JSON format.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definition: { type: Type.STRING }
              },
              required: ["term", "definition"]
            }
          }
        }
      });
      return JSON.parse(response.text || '[]');
    } catch (error) {
      return [];
    }
  }

  async reviewCode(code: string, topic: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Review this code for a lesson on "${topic}". Focus on semantic correctness, accessibility, and modern ES6+ standards. Use bullet points for suggestions and bold key concepts.
        Code:
        \`\`\`
        ${code}
        \`\`\``,
      });
      return response.text || "No feedback generated.";
    } catch (error) {
      return "Failed to review code.";
    }
  }

  async chat(message: string, history: { role: 'user' | 'assistant', content: string }[]): Promise<string> {
    try {
      // Mapping internal role names to API expected names
      const apiHistory = history.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const chat = this.ai.chats.create({
        model: 'gemini-3-flash-preview',
        history: apiHistory,
        config: { 
          systemInstruction: 'You are a friendly, highly skilled Senior Frontend Engineer mentor. Provide code examples where relevant and use bold text for emphasis.' 
        }
      });
      
      const response = await chat.sendMessage({ message });
      return response.text || "I'm listening.";
    } catch (error) {
      console.error("Chat Error:", error);
      return "Mentor is temporarily offline.";
    }
  }

  getLiveConnection(topic: string, callbacks: any) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
        },
        systemInstruction: `You are a technical interviewer testing a student on "${topic}". Speak naturally and ask follow-up questions based on their answers.`,
      },
    });
  }
}

export const geminiService = new GeminiService();

export function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
  return bytes;
}

export function encodeBase64(bytes: Uint8Array) {
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

export async function decodeAudioData(data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
  }
  return buffer;
}
