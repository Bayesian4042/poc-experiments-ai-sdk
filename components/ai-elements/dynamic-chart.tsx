"use client";

import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  Area,
  AreaChart,
  Pie,
  PieChart,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Label,
} from "recharts";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

function toTitleCase(str: string): string {
  return str
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

const colors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
  "hsl(var(--chart-6))",
  "hsl(var(--chart-7))",
  "hsl(var(--chart-8))",
];

type ChartConfig = {
  type: "bar" | "line" | "area" | "pie";
  title: string;
  description: string;
  takeaway: string;
  xKey: string;
  yKeys: string[];
  legend?: boolean;
  multipleLines?: boolean;
  measurementColumn?: string;
};

type ChartData = Record<string, any>;

export function DynamicChart({
  chartData,
  chartConfig,
}: {
  chartData: ChartData[];
  chartConfig: ChartConfig;
}) {
  const processedData = useMemo(() => {
    if (!chartData || chartData.length === 0) return [];
    
    return chartData.map((item) => {
      const parsedItem: { [key: string]: any } = {};
      for (const [key, value] of Object.entries(item)) {
        parsedItem[key] = isNaN(Number(value)) ? value : Number(value);
      }
      return parsedItem;
    });
  }, [chartData]);

  const chartContainerConfig = useMemo(() => {
    return chartConfig.yKeys.reduce(
      (acc, key, index) => {
        acc[key] = {
          label: key,
          color: colors[index % colors.length],
        };
        return acc;
      },
      {} as Record<string, { label: string; color: string }>
    );
  }, [chartConfig.yKeys]);

  const renderChart = () => {
    if (!chartData || !chartConfig) return <div>No chart data</div>;

    switch (chartConfig.type) {
      case "bar":
        return (
          <BarChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartConfig.xKey}>
              <Label
                value={toTitleCase(chartConfig.xKey)}
                offset={0}
                position="insideBottom"
              />
            </XAxis>
            <YAxis>
              <Label
                value={toTitleCase(chartConfig.yKeys[0])}
                angle={-90}
                position="insideLeft"
              />
            </YAxis>
            <ChartTooltip content={<ChartTooltipContent />} />
            {chartConfig.legend && <Legend />}
            {chartConfig.yKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                isAnimationActive={false}
              />
            ))}
          </BarChart>
        );

      case "line":
        return (
          <LineChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartConfig.xKey}>
              <Label
                value={toTitleCase(chartConfig.xKey)}
                offset={0}
                position="insideBottom"
              />
            </XAxis>
            <YAxis>
              <Label
                value={toTitleCase(chartConfig.yKeys[0])}
                angle={-90}
                position="insideLeft"
              />
            </YAxis>
            <ChartTooltip content={<ChartTooltipContent />} />
            {chartConfig.legend && <Legend />}
            {chartConfig.yKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                isAnimationActive={false}
              />
            ))}
          </LineChart>
        );

      case "area":
        return (
          <AreaChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={chartConfig.xKey}>
              <Label
                value={toTitleCase(chartConfig.xKey)}
                offset={0}
                position="insideBottom"
              />
            </XAxis>
            <YAxis>
              <Label
                value={toTitleCase(chartConfig.yKeys[0])}
                angle={-90}
                position="insideLeft"
              />
            </YAxis>
            <ChartTooltip content={<ChartTooltipContent />} />
            {chartConfig.legend && <Legend />}
            {chartConfig.yKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                fill={colors[index % colors.length]}
                stroke={colors[index % colors.length]}
                isAnimationActive={false}
              />
            ))}
          </AreaChart>
        );

      case "pie":
        return (
          <PieChart>
            <Pie
              data={processedData}
              dataKey={chartConfig.yKeys[0]}
              nameKey={chartConfig.xKey}
              cx="50%"
              cy="50%"
              outerRadius={120}
              isAnimationActive={false}
            >
              {processedData.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={colors[index % colors.length]}
                />
              ))}
            </Pie>
            <ChartTooltip content={<ChartTooltipContent />} />
            {chartConfig.legend && <Legend />}
          </PieChart>
        );

      default:
        return <div>Unsupported chart type: {chartConfig.type}</div>;
    }
  };

  return (
    <div className="w-full flex flex-col justify-center items-center p-4 border rounded-lg bg-card">
      <h2 className="text-lg font-bold mb-2">{chartConfig.title}</h2>
      {chartConfig && chartData.length > 0 && (
        <ChartContainer
          config={chartContainerConfig}
          className="h-[320px] w-full"
        >
          {renderChart()}
        </ChartContainer>
      )}
      <div className="w-full mt-4">
        <p className="text-sm text-muted-foreground">{chartConfig.description}</p>
        <p className="mt-2 text-sm font-medium">{chartConfig.takeaway}</p>
      </div>
    </div>
  );
}

