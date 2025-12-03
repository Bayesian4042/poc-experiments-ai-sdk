import { openai } from '@ai-sdk/openai';
import { Experimental_Agent as Agent, stepCountIs, UIMessage, validateUIMessages } from 'ai';
import { weatherTool } from './tools/weather';
import { newsSearchTool } from './tools/news';
import { sentimentTool } from './tools/sentiment';
import { predictionTool } from './tools/prediction';
import { sharkInvestmentTool } from './tools/shark-investments';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const researchAgent = new Agent({
    model: openai('gpt-4.1'),
    stopWhen: stepCountIs(5),
  system: `You are a Shark Tank India investment assistant with access to weather, news, sentiment, prediction, and the curated shark investments dataset.

  //   When researching a question, follow this flow:
  //   1. Identify whether the user is asking about a shark, sector, or company.
  //   2. Use the sharkInvestments tool to ground responses in real investment data.
  //   3. Supplement insights with broader context from weather, news, and sentiment tools as needed.
  //   4. Highlight key deals, industries, or dragons relevant to the question.
  //   5. Always cite the dataset path when referencing investment facts.

    data file path: /Users/abhilasha/Documents/client-projects/poc-experiments-ai-sdk/app/constants/shark-data.ts
    
    Always explain your reasoning before giving conclusions.`,
    tools: {
      weather: weatherTool,
      news: newsSearchTool,
      sentiment: sentimentTool,
      prediction: predictionTool,
      sharkInvestments: sharkInvestmentTool,
      code_interpretor: openai.tools.codeInterpreter({
      }),
    },
  });

  return researchAgent.respond({
    messages: await validateUIMessages({ messages }),
  });
}