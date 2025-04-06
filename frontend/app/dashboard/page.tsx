"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TrendingStocks } from "@/components/stocks/trending-stocks";
import { RecommendedStocks } from "@/components/stocks/recommended-stocks";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import Link from "next/link";
import { checkAuthentication } from "@/lib/auth";

export default function DashboardPage() {
  checkAuthentication();
  const [showRecommendations, setShowRecommendations] = useState(true);

  const handlePreferenceSubmit = () => {
    setShowRecommendations(true);
  };

  const previousInvestments = [
    {
      name: "Reliance Industries (RELIANCE)",
      value: "₹1,25,400",
      return: "+12.5%",
      date: "2024-05-12",
    },
    {
      name: "Tata Consultancy Services (TCS)",
      value: "₹89,300",
      return: "+8.2%",
      date: "2024-04-28",
    },
    {
      name: "Infosys Ltd (INFY)",
      value: "₹57,800",
      return: "-2.4%",
      date: "2024-03-15",
    },
    {
      name: "HDFC Bank Ltd (HDFCBANK)",
      value: "₹78,500",
      return: "+6.9%",
      date: "2024-05-05",
    },
    {
      name: "ICICI Bank Ltd (ICICIBANK)",
      value: "₹1,12,000",
      return: "+14.6%",
      date: "2024-04-20",
    },
    {
      name: "Bharti Airtel Ltd (BHARTIARTL)",
      value: "₹64,900",
      return: "-1.7%",
      date: "2024-03-28",
    },
    {
      name: "State Bank of India (SBIN)",
      value: "₹91,200",
      return: "+5.3%",
      date: "2024-03-10",
    },
    {
      name: "Adani Enterprises Ltd (ADANIENT)",
      value: "₹45,600",
      return: "-4.8%",
      date: "2024-02-18",
    },
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your AI-powered investment dashboard. Set your
            preferences to get personalized stock recommendations.
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="recommendations" className="w-full">
          <TabsContent value="recommendations" className="mt-6">
            {showRecommendations ? (
              <div className="space-y-6">
                {/* AI-Powered Recommendations */}
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <CardTitle>AI-Powered Recommendations</CardTitle>
                    </div>
                    <CardDescription>
                      Based on your preferences, our AI suggests these stocks
                      for your portfolio.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Reliance Industries (RELIANCE)",
                          price: "₹1,25,400",
                          change: "+12.5%",
                          date: "2024-05-12",
                          sector: "Energy & Petrochemicals",
                          recommendation: "Strong Buy",
                        },
                        {
                          name: "Tata Consultancy Services (TCS)",
                          price: "₹89,300",
                          change: "+8.2%",
                          date: "2024-04-28",
                          sector: "IT Services",
                          recommendation: "Buy",
                        },
                        {
                          name: "Infosys Ltd (INFY)",
                          price: "₹57,800",
                          change: "-2.4%",
                          date: "2024-03-15",
                          sector: "IT Services",
                          recommendation: "Hold",
                        },
                        {
                          name: "HDFC Bank Ltd (HDFCBANK)",
                          price: "₹78,500",
                          change: "+6.9%",
                          date: "2024-05-05",
                          sector: "Banking",
                          recommendation: "Buy",
                        },
                        {
                          name: "ICICI Bank Ltd (ICICIBANK)",
                          price: "₹1,12,000",
                          change: "+14.6%",
                          date: "2024-04-20",
                          sector: "Banking",
                          recommendation: "Strong Buy",
                        },
                        {
                          name: "Bharti Airtel Ltd (BHARTIARTL)",
                          price: "₹64,900",
                          change: "-1.7%",
                          date: "2024-03-28",
                          sector: "Telecom",
                          recommendation: "Hold",
                        },
                        {
                          name: "State Bank of India (SBIN)",
                          price: "₹91,200",
                          change: "+5.3%",
                          date: "2024-03-10",
                          sector: "Banking",
                          recommendation: "Buy",
                        },
                        {
                          name: "Adani Enterprises Ltd (ADANIENT)",
                          price: "₹45,600",
                          change: "-4.8%",
                          date: "2024-02-18",
                          sector: "Infrastructure",
                          recommendation: "Hold",
                        },
                      ].map((stock) => (
                        <div
                          key={stock.name}
                          className="flex justify-between items-center border-b pb-4 last:border-b-0"
                        >
                          <div>
                            <h3 className="font-medium">{stock.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              Sector: {stock.sector}
                            </p>
                          </div>
                          <div className="flex flex-col items-end">
                            <span>{stock.price}</span>
                            <span
                              className={
                                stock.change.startsWith("+")
                                  ? "text-green-500 text-sm"
                                  : "text-red-500 text-sm"
                              }
                            >
                              {stock.change}
                            </span>
                            <span
                              className={`mt-1 text-xs px-2 py-1 rounded ${
                                stock.recommendation === "Strong Buy"
                                  ? "bg-green-100 text-green-700"
                                  : stock.recommendation === "Buy"
                                  ? "bg-blue-100 text-blue-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {stock.recommendation}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Explore All Stocks Button */}
                <div className="flex justify-end">
                  <Link href="/stocks">
                    <Button>
                      Explore All Stocks
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              // No Recommendations Yet
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  No Recommendations Yet
                </h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Set your investment preferences first to get personalized
                  AI-powered stock recommendations.
                </p>
                <Button
                  onClick={() =>
                    document
                      .querySelector('[data-value="preferences"]')
                      ?.click()
                  }
                >
                  Set Preferences
                </Button>
              </div>
            )}
          </TabsContent>

          {/* Recommendations Tab */}

          <TabsContent value="preferences" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Investment Preferences */}
              <Card>
                <CardHeader>
                  <CardTitle>Investment Preferences</CardTitle>
                  <CardDescription>
                    Set your investment preferences to get personalized stock
                    recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { label: "Risk Level", value: "Moderate" },
                      { label: "Investment Horizon", value: "5-7 Years" },
                      {
                        label: "Sectors of Interest",
                        value: "Technology, Healthcare",
                      },
                      { label: "Goal", value: "Wealth Growth" },
                    ].map((pref) => (
                      <div
                        key={pref.label}
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium">{pref.label}</span>
                        <span className="text-muted-foreground">
                          {pref.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-col gap-6">
                {/* Trending Stocks */}
                <Card>
                  <CardHeader>
                    <CardTitle>Trending Stocks</CardTitle>
                    <CardDescription>
                      Popular stocks trending in the market today.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "Tesla Inc (TSLA)",
                          price: "$845.50",
                          change: "+3.2%",
                        },
                        {
                          name: "Apple Inc (AAPL)",
                          price: "$155.20",
                          change: "+1.8%",
                        },
                        {
                          name: "Microsoft Corp (MSFT)",
                          price: "$312.45",
                          change: "+2.1%",
                        },
                      ].map((stock) => (
                        <div
                          key={stock.name}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium">{stock.name}</span>
                          <div className="flex items-center gap-2">
                            <span>{stock.price}</span>
                            <span
                              className={
                                stock.change.startsWith("+")
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {stock.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Market Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle>Market Overview</CardTitle>
                    <CardDescription>
                      Current market status and indices.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        {
                          name: "S&P 500",
                          value: "4,587.64",
                          change: "+0.63%",
                        },
                        {
                          name: "NASDAQ",
                          value: "14,346.02",
                          change: "+0.83%",
                        },
                        { name: "DOW", value: "36,124.56", change: "+0.34%" },
                        {
                          name: "FTSE 100",
                          value: "7,652.30",
                          change: "-0.15%",
                        },
                        {
                          name: "Nikkei 225",
                          value: "28,872.30",
                          change: "+1.21%",
                        },
                      ].map((index) => (
                        <div
                          key={index.name}
                          className="flex justify-between items-center"
                        >
                          <span className="font-medium">{index.name}</span>
                          <div className="flex items-center gap-2">
                            <span>{index.value}</span>
                            <span
                              className={
                                index.change.startsWith("+")
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {index.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Link href="/realtime">
                        <Button variant="outline" className="w-full">
                          View Real-time Data
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Previous Investments Tab */}
          <TabsContent value="investments" className="mt-6">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle>Previous Investments</CardTitle>
                  </div>
                  <CardDescription>
                    Track the performance of your previous investments.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {previousInvestments.map((investment, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center border-b pb-4 last:border-none"
                      >
                        <div className="flex flex-col">
                          <span className="font-medium">{investment.name}</span>
                          <span className="text-sm text-muted-foreground">
                            Invested on {investment.date}
                          </span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className="font-medium">
                            {investment.value}
                          </span>
                          <span
                            className={
                              investment.return.startsWith("+")
                                ? "text-green-500"
                                : "text-red-500"
                            }
                          >
                            {investment.return}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6">
                    <Link href="/portfolio">
                      <Button variant="outline" className="w-full">
                        View Full Portfolio
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
