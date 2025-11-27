import { z } from "zod";
import {config} from "dotenv"

config();
export const env = z.object({
  HUGGINGFACE_API_KEY: z.string(),
  PINECONE_API_KEY: z.string(),
  PINECONE_INDEX: z.string(),
  GOOGLE_GENERATIVE_AI_API_KEY: z.string(),
  DATABASE_URL: z.string(),
  PINECONE_DOCS_INDEX: z.string(),
}).parse(process.env);
