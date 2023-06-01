import * as fs from "fs";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PlaywrightWebBaseLoader } from "langchain/document_loaders/web/playwright";
import "dotenv/config";

// Grab OPENAI api key from .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FILE_PATH = "how_to_get_rich.index";
const HOW_TO_GET_RICH_WEBSITE_LINK = "https://nav.al/rich";

// Define vectorStore variable, later assigned through files or creating it from web
let vectorStore;

// Check for vector storage saved locally (.index file)
if (fs.existsSync(FILE_PATH)) {
    // If there, just load the embeddings and other info into vectorStore
    vectorStore = await HNSWLib.load(FILE_PATH);
} else {
    // Load website body content
    const loader = new PlaywrightWebBaseLoader(HOW_TO_GET_RICH_WEBSITE_LINK);

    // Create document from the body and get the content from the created document array
    const docArr = await loader.load();
    const pageContent = docArr[0].pageContent;

    console.log(pageContent);
    
    // Convert it to a markdown or text file

    // Load the text file

    // Create chunks from the text

    // Create documents for each of those chunks

    // Create a vector store for that

    // Save the vector store to a file

    console.log("Does not exist");
}

// Create new ChatOpenAI model object with API key

// Create a BufferMemory object to store previous messages

// Create a ConversationalRetrievalQAChain chain with the model, vector store as the retriever, and memory

// While (userQuery !== "q" || userQuery !== "quit")
    // Ask the question by calling the chain with the user query passed in
