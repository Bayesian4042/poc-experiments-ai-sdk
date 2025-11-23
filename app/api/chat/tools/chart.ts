import { tool } from 'ai';
import { z } from 'zod';

export const chartGenerationTool = tool({
  name: "generateChart",
  description: `Generate a chart visualization from data. Use this when you want to visualize data in a chart format (bar, line, area, or pie chart).
  
  Guidelines:
  - For comparing categories: use bar or pie charts
  - For trends over time: use line or area charts
  - xKey should be the dimension (e.g., category, date, name)
  - yKeys should be the metrics to plot (e.g., count, value, amount)
  - Provide meaningful title, description, and takeaway
  - Set legend to true if there are multiple yKeys`,
  inputSchema: z.object({
    chartType: z.enum(['bar', 'line', 'area', 'pie']).describe('Type of chart to generate'),
    title: z.string().describe('Title of the chart'),
    description: z.string().describe('Description of what the chart shows'),
    takeaway: z.string().describe('Key insight or takeaway from the chart'),
    xKey: z.string().describe('Key for X-axis data (dimension)'),
    yKeys: z.array(z.string()).describe('Keys for Y-axis data (metrics to plot)'),
    legend: z.boolean().describe('Whether to show legend'),
    dataJson: z.string().describe('JSON string of array of data objects to visualize'),
  }),
  execute: async ({ chartType, title, description, takeaway, xKey, yKeys, legend, dataJson }) => {
    const data = JSON.parse(dataJson);
    
    return {
      type: 'chart',
      config: {
        type: chartType,
        title,
        description,
        takeaway,
        xKey,
        yKeys,
        legend,
      },
      data,
    };
  },
});

