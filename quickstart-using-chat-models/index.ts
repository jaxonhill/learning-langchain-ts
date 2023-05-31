import { ChatOpenAI } from "langchain/chat_models/openai";
import { HumanChatMessage, SystemChatMessage } from "langchain/schema";
import { SystemMessagePromptTemplate, HumanMessagePromptTemplate, ChatMessagePromptTemplate, ChatPromptTemplate } from "langchain/prompts";
import "dotenv/config";
import { LLMChain } from "langchain/chains";

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



// Asking for the completion of a formatted prompt is pretty common, so chains make it easier

const chat: ChatOpenAI = new ChatOpenAI({ openAIApiKey: OPENAI_API_KEY });

// Create an encompassing ChatPromptTemplate that is made up of other PromptTemplates
// In this case, a SystemMessagePromptTemplate and a HumanMessagePromptTemplate
const translationPromptTemplate = ChatPromptTemplate.fromPromptMessages([
    SystemMessagePromptTemplate.fromTemplate(
        "You are a helpful assistant that translates {input_language} to {output_language}."
    ),
    HumanMessagePromptTemplate.fromTemplate(
        "{text}"
    ),
]);

const chain = new LLMChain({
    prompt: translationPromptTemplate,
    llm: chat,
})

// Pass variables right into the chain call, instead of formatting first, then creating separate call
const response = await chain.call({
    input_language: "English",
    output_language: "Spanish",
    text: "I love programming using Artificial Intelligence. I like speaking in Spanish, translate this also."
});

console.log(response);