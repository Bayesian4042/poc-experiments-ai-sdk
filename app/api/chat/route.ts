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

When researching a question:
1. Identify whether the user is asking about a shark, sector, or company.
2. Use the sharkInvestments tool to ground responses in confirmed investment data and cite only high-level provenance (e.g., "Shark Tank India dataset") rather than internal file paths.
3. Reference the approved shark bios when talking about personalities, and match the slug keys (anupam-mittal, aman-gupta, namita-thapar, vineeta-singh, peyush-bansal, ghazal-alagh, amit-jain, ashneer-grover, ritesh-agarwal, kunal-bahl) when pulling data.
4. Supplement insights with weather, news, sentiment, or prediction tools only when they add contextual value.
5. Highlight the most relevant deals, industries, or dragons for the question.
6. Always explain your reasoning before stating conclusions.
7. Don't add datset path in the answer to the user like: Dataset path: app/constants/shark-data.ts
`,
    tools: {
      // weather: weatherTool,
      // news: newsSearchTool,
      // sentiment: sentimentTool,
      // prediction: predictionTool,
      sharkInvestments: sharkInvestmentTool,
      // code_interpretor: openai.tools.codeInterpreter({
      // }),
    },
  });

  return researchAgent.respond({
    messages: await validateUIMessages({ messages }),
  });
}