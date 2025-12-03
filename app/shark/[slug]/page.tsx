import { sharkInvestments } from "@/app/constants/shark-data";
import { Button } from "@/components/ui/button";
import { ArrowLeft, DollarSign, TrendingUp, Briefcase, Building2 } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PortfolioChart } from "@/components/dashboard/PortfolioChart";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { CompanyDataTable } from "@/components/dashboard/CompanyDataTable";

type PageParams = Promise<{ slug: string }>;

export default async function SharkPage({
  params,
}: {
  params: PageParams;
}) {
  const { slug } = await params;
  const shark = sharkInvestments[slug as keyof typeof sharkInvestments];

  if (!shark) {
    notFound();
  }

  // Reverse investments to show most recent first
  const recentInvestments = [...shark.investments].reverse();

  // Calculate some mock metrics based on investments
  const totalInvested = shark.investments.length * 25; // Mock calculation
  const totalCompanies = shark.investments.length;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <Link href="/" className="inline-block w-fit">
                <Button variant="ghost" className="pl-0 hover:pl-2 transition-all -ml-2">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Sharks
                </Button>
            </Link>
            <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-full overflow-hidden shrink-0 border shadow-md">
                    <Image 
                        src={shark.image} 
                        alt={shark.name}
                        fill
                        className="object-cover"
                    />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-foreground">{shark.name}</h1>
                    <p className="text-sm text-muted-foreground">
                    {shark.role}
                    </p>
                </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Invested"
            value={`₹${totalInvested}L+`}
            icon={<DollarSign className="w-6 h-6" />}
          />
          <MetricCard
            title="Current Value"
            value={`₹${Math.round(totalInvested * 2.5)}L`}
            change={24.5}
            changeLabel="vs last quarter"
            icon={<TrendingUp className="w-6 h-6" />}
          />
          <MetricCard
            title="Total ROI"
            value="150%"
            change={12.3}
            changeLabel="this year"
            icon={<Briefcase className="w-6 h-6" />}
          />
          <MetricCard
            title="Portfolio Companies"
            value={totalCompanies.toString()}
            icon={<Building2 className="w-6 h-6" />}
          />
        </div>

        {/* Chart and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <PortfolioChart />
          </div>
          <div>
            <ActivityFeed investments={recentInvestments} />
          </div>
        </div>

        {/* Companies Table */}
        <CompanyDataTable investments={recentInvestments} />
      </main>
    </div>
  );
}
