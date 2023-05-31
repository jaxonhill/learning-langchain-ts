import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatMessagePromptTemplate } from "langchain/prompts";
import "dotenv/config";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// BASIC API CALLS

// const chat: ChatOpenAI = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY })

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

