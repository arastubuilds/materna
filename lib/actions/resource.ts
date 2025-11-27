'use server';

import { vectorStore } from "../db/pinecone";
import { Document } from "langchain";
import { generateChunks } from "../ai/embeddings";
import { runRetrievalAgent } from "@/lib/ai/agent"; 
import { NewResourceParams, insertResourceSchema } from "./schema";

export const createResource = async (input: NewResourceParams) => {
  try {
    const { title, content } = insertResourceSchema.parse(input);

    const fullText = `Title: ${title}\n\n${content}`;
    const chunks = await generateChunks(fullText);

    const docs = chunks.map(
      (chunk, i) =>
        new Document({
          pageContent: chunk,
          metadata: {
            type: "resource",
            chunk: i,
            source: "user_resource",
            title, 
          },
        })
    );

    await vectorStore.addDocuments(docs);

    return "Resource successfully embedded and stored in Pinecone.";
  } catch (error) {
    console.error("Error creating resource:", error);
    return error instanceof Error && error.message.length > 0
      ? error.message
      : "Error, please try again.";
  }
};

export const findRelevantContent = async (question: string) => {
  console.log("User's question:", question);
  console.log("calling agent");
  
  const finalText = await runRetrievalAgent(question);
  console.log("final text:", finalText);
  return {
    type: "tool-result",
    tool: "getInformation",
    content: [{ type: "text", text: finalText || "I'm not sure based on the current knowledge base." }],
  };
};