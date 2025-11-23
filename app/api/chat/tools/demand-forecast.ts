import { tool } from 'ai';
import { z } from 'zod';

// Simulated demand forecasting with interesting patterns
function generateDemandForecast(zipCode: string, productCategory: string, days: number) {
  const baselineDemand = Math.floor(Math.random() * 500) + 200;
  const seasonalityFactor = Math.sin((new Date().getMonth() / 12) * Math.PI * 2) * 0.3 + 1;
  
  // Generate historical data
  const historical = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (30 - i));
    const noise = (Math.random() - 0.5) * 0.2;
    const weekendBoost = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1.0;
    const demand = Math.floor(baselineDemand * seasonalityFactor * weekendBoost * (1 + noise));
    
    return {
      date: date.toISOString().split('T')[0],
      demand,
      type: 'historical'
    };
  });
  
  // Generate forecast
  const forecast = Array.from({ length: days }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    const trend = 1 + (i / days) * 0.1; // Slight upward trend
    const noise = (Math.random() - 0.5) * 0.15;
    const weekendBoost = date.getDay() === 0 || date.getDay() === 6 ? 1.3 : 1.0;
    const demand = Math.floor(baselineDemand * seasonalityFactor * trend * weekendBoost * (1 + noise));
    const confidence = Math.max(0.7, 0.95 - (i / days) * 0.2);
    
    return {
      date: date.toISOString().split('T')[0],
      demand,
      confidence: Math.floor(confidence * 100),
      type: 'forecast'
    };
  });
  
  // Calculate insights
  const avgHistorical = historical.reduce((sum, d) => sum + d.demand, 0) / historical.length;
  const avgForecast = forecast.reduce((sum, d) => sum + d.demand, 0) / forecast.length;
  const growthRate = ((avgForecast - avgHistorical) / avgHistorical * 100).toFixed(1);
  
  // Identify peak days
  const peakDay = forecast.reduce((max, d) => d.demand > max.demand ? d : max, forecast[0]);
  const lowDay = forecast.reduce((min, d) => d.demand < min.demand ? d : min, forecast[0]);
  
  return {
    zipCode,
    productCategory,
    historical,
    forecast,
    insights: {
      avgHistoricalDemand: Math.floor(avgHistorical),
      avgForecastDemand: Math.floor(avgForecast),
      growthRate: `${growthRate}%`,
      peakDay: {
        date: peakDay.date,
        demand: peakDay.demand
      },
      lowDay: {
        date: lowDay.date,
        demand: lowDay.demand
      },
      totalForecastedDemand: forecast.reduce((sum, d) => sum + d.demand, 0)
    }
  };
}

function generateZipCodeHeatmap(zipCodes: string[], productCategory: string) {
  return zipCodes.map(zipCode => {
    const demand = Math.floor(Math.random() * 1000) + 200;
    const growth = (Math.random() * 40) - 10; // -10% to +30%
    const population = Math.floor(Math.random() * 50000) + 10000;
    const marketPenetration = (Math.random() * 60) + 20; // 20% to 80%
    
    return {
      zipCode,
      demand,
      growth: parseFloat(growth.toFixed(1)),
      population,
      marketPenetration: parseFloat(marketPenetration.toFixed(1)),
      demandDensity: parseFloat((demand / population * 1000).toFixed(2))
    };
  }).sort((a, b) => b.demand - a.demand);
}

export const demandForecastTool = tool({
  name: "forecastDemand",
  description: `Forecast product demand at zip code level with historical data, predictions, and insights. 
  This tool generates detailed demand forecasts with confidence intervals, identifies patterns, 
  and provides actionable insights for inventory and marketing decisions.`,
  inputSchema: z.object({
    zipCode: z.string().describe('ZIP code to forecast demand for (e.g., "10001", "94102")'),
    productCategory: z.string().describe('Product category to forecast (e.g., "Electronics", "Groceries", "Fashion")'),
    forecastDays: z.number().default(7).describe('Number of days to forecast (default: 7)'),
  }),
  execute: async ({ zipCode, productCategory, forecastDays }) => {
    const forecastData = generateDemandForecast(zipCode, productCategory, forecastDays);
    
    return {
      type: 'demand-forecast',
      ...forecastData
    };
  },
});

export const zipCodeAnalysisTool = tool({
  name: "analyzeZipCodes",
  description: `Analyze and compare demand across multiple zip codes. 
  Provides heatmap data showing demand density, growth rates, and market penetration by zip code.
  Perfect for identifying high-potential markets and resource allocation.`,
  inputSchema: z.object({
    zipCodes: z.array(z.string()).describe('Array of ZIP codes to analyze (e.g., ["10001", "10002", "10003"])'),
    productCategory: z.string().describe('Product category to analyze'),
  }),
  execute: async ({ zipCodes, productCategory }) => {
    const heatmapData = generateZipCodeHeatmap(zipCodes, productCategory);
    
    // Calculate summary statistics
    const totalDemand = heatmapData.reduce((sum, z) => sum + z.demand, 0);
    const avgGrowth = heatmapData.reduce((sum, z) => sum + z.growth, 0) / heatmapData.length;
    const topZipCode = heatmapData[0];
    const avgDemandDensity = heatmapData.reduce((sum, z) => sum + z.demandDensity, 0) / heatmapData.length;
    
    return {
      type: 'zipcode-analysis',
      productCategory,
      zipCodes: heatmapData,
      summary: {
        totalZipCodes: zipCodes.length,
        totalDemand,
        avgGrowthRate: parseFloat(avgGrowth.toFixed(1)),
        topPerformer: topZipCode,
        avgDemandDensity: parseFloat(avgDemandDensity.toFixed(2))
      }
    };
  },
});


