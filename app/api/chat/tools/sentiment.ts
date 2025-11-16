import { tool } from "ai";
import { z } from "zod";
import { JigsawStackToolSet } from "jigsawstack";

const SentimentSchema = z.object({
  sentiment: z.string(),
  score: z.number(),
});

export const sentimentTool = tool({
  name: "sentiment",
  description: "Analyze sentiment of text.",
  inputSchema: z.object({
    text: z.string().min(1),
  }),
  outputSchema: SentimentSchema,
  execute: async ({ text }: { text: string }) => {
    const apiKey = process.env.JIGSAWSTACK_API_KEY;
    if (!apiKey) throw new Error("JIGSAWSTACK_API_KEY not found");

    const toolset = new JigsawStackToolSet({ apiKey });
    const sentiment = await toolset.getTools({ tools: ['sentiment'] });
    
    const result = await sentiment.sentiment({ text });
    return result;
  },
});

