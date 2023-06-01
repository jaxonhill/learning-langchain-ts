import { OpenAI } from "langchain/llms/openai";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { BufferMemory } from "langchain/memory";
import "dotenv/config";
import * as fs from "fs";

// Get OpenAI key from environment variable
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Create model object, pass in OpenAI key
const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY });

// Load in the file we want
const text = fs.readFileSync("medieval_europe_notes.txt", "utf-8");

// Split the text into chunks
const textSplitter = new RecursiveCharacterTextSplitter({ chunkSize: 800, chunkOverlap: 30 });

// Create document objects based on our splitter and text
const docs = await textSplitter.createDocuments([text]);

// Create the vector store for these documents (thing that stores embeddings and can retrieve them)
const vectorStore = await HNSWLib.fromDocuments(docs, new OpenAIEmbeddings());

// Create the chain
const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
        memory: new BufferMemory({
            memoryKey: "chat_history",
        }),
    }
);

// Ask a question
const question = "Why did Rome fall?";

// Call the chain, which finds context, with the question to get a response
const response = await chain.call({ question });
console.log(response);
