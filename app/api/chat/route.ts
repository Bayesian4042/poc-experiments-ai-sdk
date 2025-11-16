import { openai } from '@ai-sdk/openai';
import { z } from 'zod';
import { Experimental_Agent as Agent, stepCountIs, tool, UIMessage, validateUIMessages } from 'ai';


export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const researchAgent = new Agent({
    model: openai('gpt-4.1'),
    system: `You are a research assistant with access to search and document tools.
  
    When researching:
    1. Always start with a broad search to understand the topic
    2. Use document analysis for detailed information
    3. Cross-reference multiple sources before drawing conclusions
    4. Cite your sources when presenting information
    5. If information conflicts, present both viewpoints`,
    // tools: {
    //   webSearch,
    //   analyzeDocument,
    //   extractQuotes,
    // },
  });

  return researchAgent.respond({
    messages: await validateUIMessages({ messages }),
  });
}