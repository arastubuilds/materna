import { Pinecone } from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";
import { embeddingModel } from "../ai/embeddings";
import { env } from "../utils/env";


export const pinecone = new Pinecone({
  apiKey: env.PINECONE_API_KEY,
});

const pineconeIndex = pinecone.index(env.PINECONE_INDEX);
const pineconeIndexDocs = pinecone.index(env.PINECONE_DOCS_INDEX);

export const vectorStore = await PineconeStore.fromExistingIndex(embeddingModel, {
  pineconeIndex,
  maxConcurrency: 5,
}); 

export const vectorStoreDocs = await PineconeStore.fromExistingIndex(embeddingModel, {
  pineconeIndex: pineconeIndexDocs,
  maxConcurrency: 5,
});