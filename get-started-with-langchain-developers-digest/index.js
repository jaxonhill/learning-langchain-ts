import * as fs from "fs";
import { FaissStore } from "langchain/vectorstores/faiss";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { BufferMemory } from "langchain/memory";
import { HumanChatMessage, AIChatMessage, SystemChatMessage, ChatMessage } from "langchain/schema";
import { ConversationalRetrievalQAChain } from "langchain/chains";
import { ChatMessageHistory } from "langchain/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { PlaywrightWebBaseLoader } from "langchain/document_loaders/web/playwright";
import TurndownService from "turndown";
import "dotenv/config";
import { createInterface } from "readline";

// Grab OPENAI api key from .env
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const FILE_PATH = "./how_to_get_rich.index";
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

// Create embeddings object with API key
const embeddingsObj = new OpenAIEmbeddings({ openAIApiKey: OPENAI_API_KEY });

// Check for vector storage saved locally (.index file)
if (fs.existsSync(FILE_PATH)) {
    // If there, just load the embeddings and other info into vectorStore
    vectorStore = await FaissStore.load(FILE_PATH, embeddingsObj);
    console.log(`\nVector Store already exists locally. Loading from "${FILE_PATH}"\n`)
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
    console.log("\nCreated documents.")
    console.log(`Rough Cost Estimate: $${calculateRoughCostFromDocuments(documents)}\n`);

    // Create a vector store for that
    vectorStore = await FaissStore.fromDocuments(documents, embeddingsObj);
    console.log("Created embeddings.");

    // Save the vector store to a file
    await vectorStore.save(FILE_PATH);
    console.log("Successfully saved embeddings!\n")
}

// Ask the question by calling the chain with the user query passed in
const reader = createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Create new ChatOpenAI model object with API key
const model = new ChatOpenAI({
    modelName: "gpt-3.5-turbo",
    openAIApiKey: OPENAI_API_KEY,
});

// Create a System Message to tell the AI what to do
const originalSystemMessage = new SystemChatMessage(
`You are a helpful assistant that answers questions about an article and book called, ` +
`"How to Get Rich," by Naval Ravikant. You will be provided context along with the user's questions. ` +
`If you cannot answer the question and you do not know the answer, even with the context provided, ` +
`then state that you do not know the answer.`
);

// Create chat history (only includes system message at the beginning)
const chatHistory = new ChatMessageHistory([originalSystemMessage]);

// Create a BufferMemory object to store previous messages
const memory = new BufferMemory({
    memoryKey: "chat_history",
    chatHistory: chatHistory,
    returnMessages: true,
});

// Create a ConversationalRetrievalQAChain chain with the model, vector store as the retriever, and memory
const chain = ConversationalRetrievalQAChain.fromLLM(
    model,
    vectorStore.asRetriever(),
    {
        memory: memory,
        verbose: true,
    },
);

// Recursively call reading in input until the user quits
const recursiveReadLine = async () => {
    reader.question("Type your question ('q' to quit): ", async (query) => {
        if (query === "q" || query === "quit") {
            return reader.close();
        }
        const response = await chain.call({ question: query });
        console.log(`\n${response.text}\n`);
        recursiveReadLine();
    });
};

recursiveReadLine();