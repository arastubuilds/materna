// import "cheerio"
import * as z from "zod";
// import { CheerioWebBaseLoader } from "@langchain/community/document_loaders/web/cheerio";

// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { tool } from "@langchain/core/tools";
import { vectorStoreDocs as vectorStore } from "../db/pinecone";

// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { model } from "../ai/llm";
// import { embeddingModel } from "./embeddings";


// export const model = new ChatGoogleGenerativeAI({
//     model: "gemini-2.5-flash-lite",

// });

// export const embeddingModel = new HuggingFaceInferenceEmbeddings({

//     model: "intfloat/e5-base-v2",
//     provider: "hf-inference"
// });

// const pinecone = new PineconeClient({

// });

// const pineconeIndex = pinecone.index("materna-docs");

// const vectorStore = new PineconeStore(embeddingModel, {
//   pineconeIndex,
//   maxConcurrency: 5,
// });

// const pTagSelector = "p";
// const cheerioLoader = new CheerioWebBaseLoader(
//   "https://www.ncbi.nlm.nih.gov/books/NBK568218/",
//   {
//     selector: pTagSelector,
//   }
// );
// const docs = await cheerioLoader.load();

// const loader = new PDFLoader("/Users/arastuvij/Desktop/MERN/Materna_v2/materna/pregnancy_book.pdf");
// const docs = await loader.load();

// console.log({docs});

// console.assert(docs.length === 1);
// console.log(`Total characters: ${docs[0].pageContent.length}`);

// console.log(docs[0].pageContent.slice(0, 500));

// const splitter = new RecursiveCharacterTextSplitter({
//   chunkSize: 500,
//   chunkOverlap: 100,
// });
// const allSplits = await splitter.splitDocuments(docs);
// console.log(`Split blog post into ${allSplits.length} sub-documents.`);

// await vectorStore.addDocuments(allSplits);

const retrieveSchema = z.object({ query: z.string() });

const retrieveFromDocs = tool(
  async ({ query }) => {
    const retrievedDocs = await vectorStore.similaritySearch(query, 2);
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



// const tools = [retrieveFromDocs];
// const systemPrompt = 
//     `You have access to a tool that retrieves context from embedded documents on maternity care.
//     Use the information gained from the tool and give the user a conscise output in 7 lines`


// const agent = createAgent({ model: model, tools, systemPrompt });

// let inputMessage = `what should i expect in my first 0-8 weeks?`;

// let agentInputs = { messages: [{ role: "user", content: inputMessage }] };

// const stream = await agent.stream(agentInputs, {
//   streamMode: "values",
// });
// for await (const step of stream) {
//   const lastMessage = step.messages[step.messages.length - 1];
//   console.log(`[${lastMessage.role}]: ${lastMessage.content}`);
//   console.log("-----\n");
// }