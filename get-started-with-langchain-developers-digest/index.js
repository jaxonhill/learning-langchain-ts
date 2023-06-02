import * as fs from "fs";
import { HNSWLib } from "langchain/vectorstores/hnswlib";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PlaywrightWebBaseLoader } from "langchain/document_loaders/web/playwright";
import TurndownService from "turndown";
import "dotenv/config";

// Grab OPENAI api key from .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FILE_PATH = "how_to_get_rich.index";
const HOW_TO_GET_RICH_WEBSITE_LINK = "https://nav.al/rich";

function calculateRoughCostFromDocuments(documents) {
    // Check cost
    let totalWords = 0;

    // Split words by spaces and add length of this array to total amt of words
    documents.forEach((doc) => {
        totalWords += doc.pageContent.split(" ").length;
    })

    // Make a rough calculation on the premise of (1000 tokens ~= 750 words)
    let totalTokens = Number(((totalWords * 1000) / 750).toFixed(2))

    // ada v2 embeddings = $0.0004 / 1000 tokens
    let totalCost = Number(((totalTokens / 1000) * 0.0004).toFixed(4));
    return totalCost;
}

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
    let documents = await textSplitter.createDocuments([markdownContent]);
    documents = documents.slice(9); // Only want documents from 9-end, beginning is random code

    console.log("Created documents.")
    console.log(`Rough Cost Estimate: $${calculateRoughCostFromDocuments(documents)}`);

    // Ask the user if they are comfortable with the cost and if they want to proceed
    

    // // Create embeddings object with API key
    // const embeddingsObj = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });

    // // Create a vector store for that
    // vectorStore = await HNSWLib.fromDocuments(documents, embeddingsObj);

    // // Save the vector store to a file
    // await vectorStore.save(FILE_PATH);

    // console.log("Successfully saved embeddings")
}

// Create new ChatOpenAI model object with API key

// Create a BufferMemory object to store previous messages

// Create a ConversationalRetrievalQAChain chain with the model, vector store as the retriever, and memory

// While (userQuery !== "q" || userQuery !== "quit")
    // Ask the question by calling the chain with the user query passed in
