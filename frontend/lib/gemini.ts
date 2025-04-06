import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let chatInstance: any = null;

function cleanText(text: string): string {
  return text
    .trim()
    .replace(/\*\*(.*?)\*\*/g, "$1") // remove bold markdown
    .replace(/[_*`~]/g, "") // remove other markdown characters
    .replace(/\n{2,}/g, "\n"); // collapse multiple line breaks
}

export const client = {
  async createMessage(message: string) {
    if (!chatInstance) {
      chatInstance = await model.startChat({ history: [] });
    }

    const result = await chatInstance.sendMessage(message);
    const response = await result.response;
    const text = await response.text();

    return cleanText(text);
  },
};
