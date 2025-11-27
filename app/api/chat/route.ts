import { streamText, convertToModelMessages, UIMessage, tool, stepCountIs } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

import { findRelevantContent } from "@/lib/actions/resource";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: `
    You are "Materna" — a supportive and knowledgeable maternal health assistant.

    You have access to two retrieval tools:

    1. **Community Retrieval Tool** — searches a user-generated knowledge base of posts and shared experiences related to maternal care and health.
    2. **Guide Retrieval Tool** — searches a curated collection of professional documents, research papers, and health guides.

    When answering a question:
    - Decide **which tool** (or both) to call based on the user's intent:
      - If the question is about *personal experiences, advice, or symptoms*, use the **Community Retrieval Tool**.
      - If the question is about *facts, safety, medication, or medical guidance*, use the **Guide Retrieval Tool**.
      - If uncertain, you may call both.
    - Use the retrieved context to form a warm, concise, and trustworthy answer.
    - If neither source yields relevant context, reply:
      "I'm not sure based on the current knowledge base."

    Your tone should remain warm, respectful, and informative — like a trusted companion helping someone understand maternal health.
    `,
    messages: convertToModelMessages(messages),
    stopWhen: stepCountIs(5),
    tools: {
      // Add new content to the knowledge base
      // addResource: tool({
      //   description: "Add a new maternal health resource to the Pinecone knowledge base.",
      //   inputSchema: z.object({
      //     content: z.string().describe("The resource text or content to embed."),
      //   }),
      //   execute: async ({ content }) => createResource({ content }),
      // }),

      // Use the LangChain agent for retrieval
      getInformation: tool({
        description: "Use the LangChain retrieval agent to find relevant information and answer the question.",
        inputSchema: z.object({
          question: z.string().describe("The user's question or query."),
        }),
        execute: async ({ question }) => findRelevantContent(question),
      }),
    }
  });

  return result.toUIMessageStreamResponse();
}
