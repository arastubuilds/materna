import * as z from "zod";
import { model } from "./llm";
import { tool } from "@langchain/core/tools";
import { vectorStore, vectorStoreDocs } from "../db/pinecone";
import { createAgent } from "langchain";


// import { createAgent } from "langchain";

const retrieveSchema = z.object({
    query: z.string().describe("User's question or query."),
});

const retrieve = tool(
  async ({ query }) => {
    const retrievedDocs = await vectorStore.similaritySearch(query, 3);
    const serialized = retrievedDocs
      .map(
        (doc) => `Source: ${doc.metadata.source || "unkown"}\nContent: ${doc.pageContent}`
      )
      .join("\n");
    return [serialized, retrievedDocs];
  },
  {
    name: "retrieve",
    description: "Retrieve relevant information from prior user submissions.",
    schema: retrieveSchema,
    responseFormat: "content_and_artifact",
  }
);
const retrieveFromDocs = tool(
  async ({ query }) => {
    const retrievedDocs = await vectorStoreDocs.similaritySearch(query, 2);
    const serialized = retrievedDocs
      .map(
        (doc) => `Source: ${doc.metadata.source}\nContent: ${doc.pageContent}`
      )
      .join("\n");
    return [serialized, retrievedDocs];
  },
  {
    name: "retrieve-from-docs",
    description: "Retrieve information related to a query from embedded documents on the subject matter.",
    schema: retrieveSchema,
    responseFormat: "content_and_artifact",
  }
);

const tools = [retrieve, retrieveFromDocs];

const systemPrompt = `
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
`;


export async function runRetrievalAgent(query: string) {
  // Explicitly call both tools
  console.log("agent called");
  // await agent(query);
  const [community, guides] = await Promise.all([
    retrieve.invoke({ query }),
    retrieveFromDocs.invoke({ query }),
  ]);
  console.log("tools invoked");

  const context = `
    Community Knowledge Base:
    ${community}

    Professional Guides:
    ${guides}
    `;
    // Let the model reason over both contexts
  const response = await model.invoke([
    { role: "system", content: systemPrompt },
    {
      role: "user",
      content: `User question: ${query}\n\nUse both sources above to respond appropriately:\n${context}`,
    },
  ]);
  // console.log("response: ", response);
  
  return response.content;
}

// const prettyPrint = (message) => {
//   let txt = `[${message._getType()}]: ${message.content}`;
//   if ((isAIMessage(message) && message.tool_calls?.length) || 0 > 0) {
//     const tool_calls = (message)?.tool_calls
//       ?.map((tc) => `- ${tc.name}(${JSON.stringify(tc.args)})`)
//       .join("\n");
//     txt += ` \nTools: \n${tool_calls}`;
//   }
//   console.log(txt);
// };

export async function agent(query: string){
  const agent = createAgent({
    model,
    tools,
    systemPrompt,
  });
  const response = await agent.invoke({
    messages: [{ role: "user", content: query }],
  });
  console.log("create agent response:", response.messages);

}

