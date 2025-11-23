import { openai } from '@ai-sdk/openai';
import { Experimental_Agent as Agent, stepCountIs, UIMessage, validateUIMessages } from 'ai';
import { weatherTool } from './tools/weather';
import { newsSearchTool } from './tools/news';
import { sentimentTool } from './tools/sentiment';
import { predictionTool } from './tools/prediction';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const researchAgent = new Agent({
    model: openai('gpt-4.1'),
    stopWhen: stepCountIs(5),
    system: `You are a demand forecasting assistant with access to weather, news, sentiment analysis, and time series prediction tools.
    
  //   When analyzing demand, think step by step:
  //   1. First, identify what data you need (weather, news, historical patterns)
  //   2. Use the appropriate tools to gather data
  //   3. Analyze correlations between factors (weather impact, market sentiment)
  //   4. Consider seasonal patterns and trends
  //   5. Provide data-driven insights for pincode-level forecasting

    data csv file path: /Users/abhilasha/Documents/client-projects/poc-experiments-ai-sdk/app/constants/product_data.csv
    
    Always explain your reasoning process before providing conclusions.`,
    tools: {
      weather: weatherTool,
      news: newsSearchTool,
      sentiment: sentimentTool,
      prediction: predictionTool,
      code_interpretor: openai.tools.codeInterpreter({
      }),
    },
  });

  return researchAgent.respond({
    messages: await validateUIMessages({ messages }),
  });
}