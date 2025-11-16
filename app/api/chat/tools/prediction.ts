import { tool } from "ai";
import { z } from "zod";
import { JigsawStack } from "jigsawstack";

const PredictionSchema = z.object({
  predictions: z.array(z.object({
    date: z.string(),
    value: z.number(),
  })),
});

export const predictionTool = tool({
  name: "prediction",
  description: "Predict future values based on time series data.",
  inputSchema: z.object({
    dataset: z.array(z.object({
      date: z.string(),
      value: z.number(),
    })),
    steps: z.number().min(1).max(10).default(3),
  }),
  outputSchema: PredictionSchema,
  execute: async ({ dataset, steps }: { dataset: Array<{ date: string; value: number }>; steps: number }) => {
    const apiKey = process.env.JIGSAWSTACK_API_KEY;
    if (!apiKey) throw new Error("JIGSAWSTACK_API_KEY not found");

    const jigsaw = JigsawStack({ apiKey });
    const response = await jigsaw.prediction({ dataset, steps });
    
    return { predictions: response };
  },
});

