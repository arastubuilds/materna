import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { env } from "../utils/env";

export const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite",
    apiKey: env.GOOGLE_GENERATIVE_AI_API_KEY
});