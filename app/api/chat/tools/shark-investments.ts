import { tool } from 'ai';
import { z } from 'zod';
import { sharkInvestments } from '@/app/constants/shark-data';

type SharkEntry = {
  slug: string;
  name: string;
  role: string;
  image: string;
  investments: Array<{
    company: string;
    industry: string;
    amount: string;
    equity: string;
    debt: string;
    dealValuation: string;
    yearlyRevenue: string;
    startedIn: string;
    location: string;
    originalAsk: string;
    season: string;
  }>;
};

type FlattenedInvestment = SharkEntry['investments'][number] & {
  sharkSlug: string;
  sharkName: string;
};

export type SharkInvestmentToolResult = {
  type: 'shark-investments';
  focus: string;
  summary: string;
  highlights: Array<{ label: string; value: string }>;
  industries: string[];
  topCompanies: Array<{
    company: string;
    industry: string;
    amount: string;
    equity: string;
    season: string;
    shark: string;
    location: string;
  }>;
  focusedSharks: Array<{
    name: string;
    slug: string;
    role: string;
    dealCount: number;
  }>;
  query?: string;
  message?: string;
};

const sharks: SharkEntry[] = Object.entries(sharkInvestments).map(
  ([slug, info]) => ({
    slug,
    name: info.name,
    role: info.role,
    image: info.image,
    investments: info.investments ?? [],
  })
);

const allInvestments: FlattenedInvestment[] = sharks.flatMap((shark) =>
  shark.investments.map((investment) => ({
    ...investment,
    sharkSlug: shark.slug,
    sharkName: shark.name,
  }))
);

const topSharksByDeals = sharks
  .map((shark) => ({
    name: shark.name,
    slug: shark.slug,
    role: shark.role,
    dealCount: shark.investments.length,
  }))
  .sort((a, b) => b.dealCount - a.dealCount)
  .slice(0, 3);

export const sharkInvestmentTool = tool({
  name: 'sharkInvestments',
  description: 'Look up Shark Tank India investors, their sectors, and past deals from the curated dataset.',
  inputSchema: z.object({
    slug: z.string().optional(),
    industry: z.string().optional(),
    company: z.string().optional(),
    query: z.string().optional(),
  }),
  execute: async ({ slug, industry, company, query }) => {
    const normalizedSlug = slug?.trim().toLowerCase();
    const normalizedIndustry = industry?.trim().toLowerCase();
    const normalizedCompany = company?.trim().toLowerCase();
    const normalizedQuery = query?.trim().toLowerCase();

    const targetShark =
      (normalizedSlug &&
        sharks.find((shark) => shark.slug === normalizedSlug)) ??
      (normalizedQuery &&
        sharks.find((shark) =>
          shark.name.toLowerCase().includes(normalizedQuery)
        ));

    let filteredInvestments = allInvestments;
    let focusLabel = 'Shark Tank India dataset';

    if (targetShark) {
      focusLabel = targetShark.name;
      filteredInvestments = filteredInvestments.filter(
        (investment) => investment.sharkSlug === targetShark.slug
      );
    } else if (normalizedCompany) {
      focusLabel = company ?? normalizedCompany;
      filteredInvestments = filteredInvestments.filter((investment) =>
        investment.company.toLowerCase().includes(normalizedCompany)
      );
    } else if (normalizedIndustry) {
      focusLabel = industry ?? normalizedIndustry;
      filteredInvestments = filteredInvestments.filter((investment) =>
        investment.industry.toLowerCase().includes(normalizedIndustry)
      );
    } else if (normalizedQuery) {
      focusLabel = query ?? normalizedQuery;
      filteredInvestments = filteredInvestments.filter(
        (investment) =>
          investment.company.toLowerCase().includes(normalizedQuery) ||
          investment.industry.toLowerCase().includes(normalizedQuery) ||
          investment.sharkName.toLowerCase().includes(normalizedQuery)
      );
    }

    let usedFallback = false;
    if (filteredInvestments.length === 0) {
      usedFallback = true;
      focusLabel = 'Shark Tank India dataset overview';
      filteredInvestments = allInvestments.slice(0, 12);
    }

    const industries = Array.from(
      new Set(
        filteredInvestments
          .map((investment) => investment.industry)
          .filter(Boolean)
      )
    ).slice(0, 6);

    const dealsCount = filteredInvestments.length;
    const uniqueSharks = new Set(
      filteredInvestments.map((investment) => investment.sharkSlug)
    ).size;

    const highlights = [
      { label: 'Deals', value: `${dealsCount}` },
      { label: 'Sharks', value: `${uniqueSharks}` },
      { label: 'Industries', value: `${industries.length}` },
    ];

    const companyMap = new Map<string, FlattenedInvestment>();
    for (const investment of filteredInvestments) {
      if (!companyMap.has(investment.company)) {
        companyMap.set(investment.company, investment);
        if (companyMap.size >= 4) {
          break;
        }
      }
    }

    const topCompanies = Array.from(companyMap.values()).map((investment) => ({
      company: investment.company,
      industry: investment.industry,
      amount: investment.amount,
      equity: investment.equity,
      season: investment.season,
      shark: investment.sharkName,
      location: investment.location,
    }));

    const summaryParts: string[] = [];
    if (targetShark) {
      summaryParts.push(
        `${targetShark.name} has ${dealsCount} verified deals across ${industries.length} industries.`
      );
    } else if (normalizedCompany) {
      summaryParts.push(
        `Found ${dealsCount} entries for ${company ?? normalizedCompany}.`
      );
    } else if (normalizedIndustry) {
      summaryParts.push(
        `Analyzing ${dealsCount} Shark Tank deals in ${industry ?? normalizedIndustry}.`
      );
    } else if (normalizedQuery && !usedFallback) {
      summaryParts.push(
        `Matching investments for "${query ?? normalizedQuery}": ${dealsCount} deals.`
      );
    } else {
      summaryParts.push('Snapshot of Shark Tank India investor activity.');
    }

    if (usedFallback) {
      summaryParts.push('Showing a curated sample from the full dataset.');
    }

    const summary = summaryParts.join(' ');

    const focusedSharks =
      targetShark !== undefined
        ? [
            {
              name: targetShark.name,
              slug: targetShark.slug,
              role: targetShark.role,
              dealCount: targetShark.investments.length,
            },
          ]
        : topSharksByDeals;

    return {
      type: 'shark-investments',
      focus: focusLabel,
      summary,
      highlights,
      industries,
      topCompanies,
      focusedSharks,
      query: query?.trim(),
      message: usedFallback
        ? 'No direct matches were found; showing a representative slice instead.'
        : undefined,
    };
  },
});


