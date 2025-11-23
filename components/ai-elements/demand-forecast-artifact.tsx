"use client";

import {
  Artifact,
  ArtifactAction,
  ArtifactActions,
  ArtifactClose,
  ArtifactContent,
  ArtifactDescription,
  ArtifactHeader,
  ArtifactTitle,
} from "./artifact";
import { DynamicChart } from "./dynamic-chart";
import {
  Download,
  Share2,
  TrendingUp,
  MapPin,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type DemandForecastData = {
  type: "demand-forecast";
  zipCode: string;
  productCategory: string;
  historical: Array<{ date: string; demand: number; type: string }>;
  forecast: Array<{
    date: string;
    demand: number;
    confidence: number;
    type: string;
  }>;
  insights: {
    avgHistoricalDemand: number;
    avgForecastDemand: number;
    growthRate: string;
    peakDay: { date: string; demand: number };
    lowDay: { date: string; demand: number };
    totalForecastedDemand: number;
  };
};

type ZipCodeAnalysisData = {
  type: "zipcode-analysis";
  productCategory: string;
  zipCodes: Array<{
    zipCode: string;
    demand: number;
    growth: number;
    population: number;
    marketPenetration: number;
    demandDensity: number;
  }>;
  summary: {
    totalZipCodes: number;
    totalDemand: number;
    avgGrowthRate: number;
    topPerformer: {
      zipCode: string;
      demand: number;
      growth: number;
    };
    avgDemandDensity: number;
  };
};

interface DemandForecastArtifactProps {
  data: DemandForecastData | ZipCodeAnalysisData;
  onClose?: () => void;
}

export function DemandForecastArtifact({
  data,
  onClose,
}: DemandForecastArtifactProps) {
  if (data.type === "demand-forecast") {
    return (
      <DemandForecastView data={data as DemandForecastData} onClose={onClose} />
    );
  }

  return (
    <ZipCodeAnalysisView
      data={data as ZipCodeAnalysisData}
      onClose={onClose}
    />
  );
}

function DemandForecastView({
  data,
  onClose,
}: {
  data: DemandForecastData;
  onClose?: () => void;
}) {
  const allData = [...data.historical, ...data.forecast];
  const growthIsPositive = parseFloat(data.insights.growthRate) >= 0;

  return (
    <Artifact className="h-full flex flex-col">
      <ArtifactHeader>
        <div className="flex-1">
          <ArtifactTitle>
            Demand Forecast - {data.productCategory}
          </ArtifactTitle>
          <ArtifactDescription className="flex items-center gap-2 mt-1">
            <MapPin className="size-3" />
            <span>ZIP Code: {data.zipCode}</span>
            <Badge
              variant={growthIsPositive ? "default" : "secondary"}
              className="ml-2"
            >
              <TrendingUp className="size-3 mr-1" />
              {data.insights.growthRate} Growth
            </Badge>
          </ArtifactDescription>
        </div>
        <ArtifactActions>
          <ArtifactAction icon={Download} tooltip="Download" />
          <ArtifactAction icon={Share2} tooltip="Share" />
          {onClose && <ArtifactClose onClick={onClose} />}
        </ArtifactActions>
      </ArtifactHeader>

      <ArtifactContent className="overflow-y-auto space-y-4">
        <DynamicChart
          chartData={allData}
          chartConfig={{
            type: "line",
            title: `${data.productCategory} Demand Forecast`,
            description: `Historical trends and ${data.forecast.length}-day forecast for ZIP ${data.zipCode}`,
            takeaway: `Expected ${data.insights.growthRate} growth in demand`,
            xKey: "date",
            yKeys: ["demand"],
            legend: true,
          }}
        />

        <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Historical Avg
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.insights.avgHistoricalDemand.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                units/day
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Forecast Avg
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.insights.avgForecastDemand.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                units/day
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Forecast
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.insights.totalForecastedDemand.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                units total
              </p>
            </CardContent>
          </Card>
        </div>
      </ArtifactContent>
    </Artifact>
  );
}

function ZipCodeAnalysisView({
  data,
  onClose,
}: {
  data: ZipCodeAnalysisData;
  onClose?: () => void;
}) {
  return (
    <Artifact className="h-full flex flex-col">
      <ArtifactHeader>
        <div className="flex-1">
          <ArtifactTitle>
            ZIP Code Analysis - {data.productCategory}
          </ArtifactTitle>
          <ArtifactDescription className="flex items-center gap-2 mt-1">
            <BarChart3 className="size-3" />
            <span>{data.summary.totalZipCodes} ZIP codes analyzed</span>
            <Badge variant="outline" className="ml-2">
              {data.summary.avgGrowthRate > 0 ? "+" : ""}
              {data.summary.avgGrowthRate}% Avg Growth
            </Badge>
          </ArtifactDescription>
        </div>
        <ArtifactActions>
          <ArtifactAction icon={Download} tooltip="Download" />
          <ArtifactAction icon={Share2} tooltip="Share" />
          {onClose && <ArtifactClose onClick={onClose} />}
        </ArtifactActions>
      </ArtifactHeader>

      <ArtifactContent className="overflow-y-auto space-y-4">
        <DynamicChart
          chartData={data.zipCodes}
          chartConfig={{
            type: "bar",
            title: "Demand by ZIP Code",
            description: `${data.productCategory} demand comparison`,
            takeaway: `ZIP ${data.summary.topPerformer.zipCode} leads with ${data.summary.topPerformer.demand.toLocaleString()} units`,
            xKey: "zipCode",
            yKeys: ["demand"],
            legend: false,
          }}
        />

        <div className="grid gap-3 md:grid-cols-3">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Total Demand
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.summary.totalDemand.toLocaleString()}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                all ZIP codes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Top Performer
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.summary.topPerformer.zipCode}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {data.summary.topPerformer.demand.toLocaleString()} units
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">
                Avg Growth
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.summary.avgGrowthRate > 0 ? "+" : ""}
                {data.summary.avgGrowthRate}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                year-over-year
              </p>
            </CardContent>
          </Card>
        </div>
      </ArtifactContent>
    </Artifact>
  );
}

