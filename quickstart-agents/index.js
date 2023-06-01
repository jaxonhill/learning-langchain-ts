import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatMessagePromptTemplate, ChatPromptTemplate } from "langchain/prompts";
import "dotenv/config";
import { LLMChain } from "langchain/chains";
import { SerpAPI } from "langchain/tools";
import { AgentExecutor, ChatAgent, initializeAgentExecutorWithOptions } from "langchain/agents";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// BASIC API CALLS

// const chat: ChatOpenAI = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY });

// const response = await chat.call([
//     new SystemChatMessage(
//         "You are a helpful assistant that translates English to French."
//     ),
//     new HumanChatMessage(
//         "Translate: I love programming."
//     ),
// ]);

// console.log(response);





// MESSAGE TEMPLATES

// const chat: ChatOpenAI = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY });

// // Create an encompassing ChatPromptTemplate that is made up of other PromptTemplates
// // In this case, a SystemMessagePromptTemplate and a HumanMessagePromptTemplate
// const translationPromptTemplate = ChatPromptTemplate.fromPromptMessages([
//     SystemMessagePromptTemplate.fromTemplate(
//         "You are a helpful assistant that translates {input_language} to {output_language}."
//     ),
//     HumanMessagePromptTemplate.fromTemplate(
//         "{text}"
//     ),
// ]);

// // Pass in variables to create the final prompt object that contains an array of Messages
// const finalPromptObject = await translationPromptTemplate.formatPromptValue({
//     input_language: "English",
//     output_language: "Spanish",
//     text: "I love programming a computer",
// });

// const response = await chat.generatePrompt([finalPromptObject,]);

// console.log(response.generations[0]);





// CHAINS
// Asking for the completion of a formatted prompt is pretty common, so chains make it easier

// const chat: ChatOpenAI = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY });

// // Create an encompassing ChatPromptTemplate that is made up of other PromptTemplates
// // In this case, a SystemMessagePromptTemplate and a HumanMessagePromptTemplate
// const translationPromptTemplate = ChatPromptTemplate.fromPromptMessages([
//     SystemMessagePromptTemplate.fromTemplate(
//         "You are a helpful assistant that translates {input_language} to {output_language}."
//     ),
//     HumanMessagePromptTemplate.fromTemplate(
//         "{text}"
//     ),
// ]);

// const chain = new LLMChain({
//     prompt: translationPromptTemplate,
//     llm: chat,
// })

// // Pass variables right into the chain call, instead of formatting first, then creating separate call
// const response = await chain.call({
//     input_language: "English",
//     output_language: "Spanish",
//     text: "I love programming using Artificial Intelligence. I like speaking in Spanish, translate this also."
// });

// console.log(response);





// AGENTS

// Get SerpAPI API key from env to be able to search the web
const SERPAPI_API_KEY = process.env.SERPAPI_API_KEY;

// Init the chat model
const chat = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY });

// Define a list of tools that an agent can use
const tools = [
    new SerpAPI(SERPAPI_API_KEY, {
        location: "Los Angeles, California, United States",
        hl: "en",
        gl: "us",
    }),
];

// Create the executor, which itself creates an agent to run based on the tools and models
// Doing it this way just allows us to provide options, so we can see what is happening
const executor = await initializeAgentExecutorWithOptions(tools, chat, {
    agentType: "chat-conversational-react-description",
    verbose: true,
});

// Get the response by running the executor
const response = await executor.call({
    input: "Find evidence that there are negative impacts of social media usage for teens",
});

console.log(response);