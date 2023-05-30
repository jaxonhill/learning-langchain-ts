import { OpenAI } from "langchain/llms/openai";

import "dotenv/config";


const model: OpenAI = new OpenAI({ openAIApiKey: process.env.OPENAI_API_KEY, temperature: 1.0 });

const res = await model.call("What would be a good company name for a company that makes colorful socks?");
console.log(res);