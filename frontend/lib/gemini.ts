import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

let chatInstance: any = null;

export const client = {
  async createMessage(message: string) {
    if (!chatInstance) {
      chatInstance = await model.startChat({ history: [] });
    }

    const result = await chatInstance.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    return text;
  },
};
