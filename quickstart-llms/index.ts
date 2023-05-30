import { OpenAI } from "langchain/llms/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import "dotenv/config";

// Grab our OpenAI key from .env
const OPENAI_API_KEY: string | undefined = process.env.OPENAI_API_KEY;

// Init the model
const model = new OpenAI({ openAIApiKey: OPENAI_API_KEY, temperature: 0.9 });

// Create a dynamic variable in between these curly brackets
const template: string = "What is a good name for a company that makes {product}?";

// Create a prompt template object and pass in that the input variables are the ones you defined above
const prompt: PromptTemplate = new PromptTemplate({
    template: template,
    inputVariables: ["product"],
});

// Create a simple chain using the prompt and model
const chain = new LLMChain({llm: model, prompt: prompt});

// Now we can run that chain specifying only the product
const res = await chain.call({product: "tech polos"});

console.log(res.text);