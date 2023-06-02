import * as fs from "fs";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PlaywrightWebBaseLoader } from "langchain/document_loaders/web/playwright";
import TurndownService from "turndown";
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

    // Turn HTML into Markdown
    const turndownService = new TurndownService();
    const markdownContent = turndownService.turndown(pageContent);

    // Create textSplitter object from the Markdown
    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 2000,
        chunkOverlap: 200,
    });

    // Create documents (chunks of text with more info attached)
    const documents = await textSplitter.createDocuments([markdownContent]);

    // Create a vector store for that

    // Save the vector store to a file

}

// Create new ChatOpenAI model object with API key

// Create a BufferMemory object to store previous messages

// Create a ConversationalRetrievalQAChain chain with the model, vector store as the retriever, and memory

// While (userQuery !== "q" || userQuery !== "quit")
    // Ask the question by calling the chain with the user query passed in
