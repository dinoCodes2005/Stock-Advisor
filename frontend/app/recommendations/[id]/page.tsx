"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ArrowRight,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  LineChart,
  PieChart,
  Sparkles,
  Star,
  Clock,
  Calendar,
  AlertCircle,
  Info,
  Lightbulb,
  Zap,
  Filter,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";
import { useParams, useRouter } from "next/navigation";

// Mock data for recommendations
const stockRecommendations = [
  {
    symbol: "AAPL",
    name: "Apple Inc.",
    price: 187.32,
    change: 2.45,
    changePercent: 1.32,
    aiScore: 92,
    recommendation: "Strong Buy",
    reasonShort: "Strong product pipeline and services growth",
    reasonLong:
      "Apple continues to show strong growth in its services segment, which has higher margins than hardware. The upcoming product refresh cycle and potential new categories like AR/VR present significant upside potential.",
    targetPrice: 215.5,
    riskLevel: "Low",
    timeHorizon: "Long-term",
    sector: "Technology",
    tags: ["Blue Chip", "Dividend", "Innovation"],
  },
  {
    symbol: "MSFT",
    name: "Microsoft Corp.",
    price: 378.85,
    change: 4.21,
    changePercent: 1.12,
    aiScore: 95,
    recommendation: "Strong Buy",
    reasonShort: "Cloud dominance and AI integration",
    reasonLong:
      "Microsoft's Azure cloud platform continues to gain market share, while the company's strategic investments in AI and integration across its product suite position it well for future growth. Strong recurring revenue from Microsoft 365 provides stability.",
    targetPrice: 420.0,
    riskLevel: "Low",
    timeHorizon: "Long-term",
    sector: "Technology",
    tags: ["Cloud", "AI", "Dividend"],
  },
  {
    symbol: "NVDA",
    name: "NVIDIA Corp.",
    price: 487.21,
    change: 12.34,
    changePercent: 2.6,
    aiScore: 90,
    recommendation: "Buy",
    reasonShort: "AI chip dominance and data center growth",
    reasonLong:
      "NVIDIA maintains its leadership position in AI chips, with growing demand from data centers, cloud providers, and AI startups. While valuation is high, the company's technological edge and expanding market opportunities justify a premium.",
    targetPrice: 550.0,
    riskLevel: "Medium",
    timeHorizon: "Medium-term",
    sector: "Technology",
    tags: ["AI", "Semiconductor", "High Growth"],
  },
  {
    symbol: "AMZN",
    name: "Amazon.com Inc.",
    price: 178.23,
    change: 3.45,
    changePercent: 1.97,
    aiScore: 88,
    recommendation: "Buy",
    reasonShort: "E-commerce recovery and AWS strength",
    reasonLong:
      "Amazon's e-commerce business is showing signs of recovery with improving margins, while AWS continues to be a profit engine despite increased competition. The company's investments in logistics and AI should drive long-term growth.",
    targetPrice: 200.0,
    riskLevel: "Medium",
    timeHorizon: "Long-term",
    sector: "Consumer Cyclical",
    tags: ["E-commerce", "Cloud", "Logistics"],
  },
  {
    symbol: "TSLA",
    name: "Tesla Inc.",
    price: 245.67,
    change: -3.89,
    changePercent: -1.56,
    aiScore: 75,
    recommendation: "Hold",
    reasonShort: "EV competition and margin pressure",
    reasonLong:
      "Tesla faces increasing competition in the EV market and margin pressure from price cuts. However, its technology leadership, manufacturing scale, and energy business provide long-term potential. Investors should monitor production numbers and margins closely.",
    targetPrice: 250.0,
    riskLevel: "High",
    timeHorizon: "Long-term",
    sector: "Automotive",
    tags: ["EV", "Energy", "Volatility"],
  },
  {
    symbol: "JPM",
    name: "JPMorgan Chase & Co.",
    price: 198.45,
    change: 1.23,
    changePercent: 0.62,
    aiScore: 85,
    recommendation: "Buy",
    reasonShort: "Strong financial position and dividend growth",
    reasonLong:
      "JPMorgan maintains a strong balance sheet and leading market positions across its businesses. The bank has demonstrated resilience through economic cycles and continues to return capital to shareholders through dividends and buybacks.",
    targetPrice: 215.0,
    riskLevel: "Medium",
    timeHorizon: "Medium-term",
    sector: "Financial Services",
    tags: ["Banking", "Dividend", "Value"],
  },
  {
    symbol: "GOOGL",
    name: "Alphabet Inc.",
    price: 142.56,
    change: 1.23,
    changePercent: 0.87,
    aiScore: 87,
    recommendation: "Buy",
    reasonShort: "Search dominance and AI integration",
    reasonLong:
      "Google's search business continues to generate strong cash flows, while the company's investments in AI and cloud are showing promising results. Regulatory concerns remain, but the company's diversified revenue streams and innovation provide resilience.",
    targetPrice: 160.0,
    riskLevel: "Medium",
    timeHorizon: "Long-term",
    sector: "Technology",
    tags: ["Search", "AI", "Digital Advertising"],
  },
  {
    symbol: "V",
    name: "Visa Inc.",
    price: 267.89,
    change: 1.23,
    changePercent: 0.46,
    aiScore: 89,
    recommendation: "Buy",
    reasonShort: "Payment network moat and global expansion",
    reasonLong:
      "Visa's payment network benefits from strong network effects and high margins. The company is well-positioned to benefit from the ongoing shift to digital payments globally, with opportunities in emerging markets and new payment technologies.",
    targetPrice: 290.0,
    riskLevel: "Low",
    timeHorizon: "Long-term",
    sector: "Financial Services",
    tags: ["Payments", "Fintech", "Dividend"],
  },
];

export default function RecommendationsPage() {
  const [activeTab, setActiveTab] = useState("stocks");
  const [refreshing, setRefreshing] = useState(false);
  const [showAIExplanations, setShowAIExplanations] = useState(true);
  const [selectedStock, setSelectedStock] = useState<string | null>(null);
  const { theme } = useTheme();
  const router = useRouter();
  const params = useParams();
  const id = params?.id;
  const [recommendations, setRecommendations] = useState([]);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:8000/investment/recommendations/${id}/`)
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setRecommendations(data);
        })
        .catch((err) => console.error(err));

      console.log(recommendations);
    }
  }, [id]);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case "Strong Buy":
        return "bg-green-500/10 text-green-500 dark:bg-green-500/20";
      case "Buy":
        return "bg-emerald-500/10 text-emerald-500 dark:bg-emerald-500/20";
      case "Hold":
        return "bg-amber-500/10 text-amber-500 dark:bg-amber-500/20";
      case "Sell":
        return "bg-red-500/10 text-red-500 dark:bg-red-500/20";
      case "Strong Sell":
        return "bg-red-700/10 text-red-700 dark:bg-red-700/20";
      default:
        return "bg-primary/10 text-primary";
    }
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "warning":
        return <AlertCircle className="h-5 w-5 text-amber-500" />;
      case "suggestion":
        return <Lightbulb className="h-5 w-5 text-blue-500" />;
      case "info":
        return <Info className="h-5 w-5 text-primary" />;
      case "alert":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Info className="h-5 w-5 text-primary" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case "warning":
        return "border-amber-500/20 bg-amber-500/5";
      case "suggestion":
        return "border-blue-500/20 bg-blue-500/5";
      case "info":
        return "border-primary/20 bg-primary/5";
      case "alert":
        return "border-red-500/20 bg-red-500/5";
      default:
        return "border-primary/20 bg-primary/5";
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">
                AI Recommendations
              </h1>
              <p className="text-muted-foreground">
                Personalized investment insights and recommendations powered by
                AI.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="ai-explanations"
                  checked={showAIExplanations}
                  onCheckedChange={setShowAIExplanations}
                />
                <Label htmlFor="ai-explanations" className="text-sm">
                  Show AI Explanations
                </Label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw
                  className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="stocks">Stock Picks</TabsTrigger>
            <TabsTrigger value="portfolio">Portfolio Insights</TabsTrigger>
            <TabsTrigger value="market">Market Analysis</TabsTrigger>
          </TabsList> */}

          <TabsContent value="stocks" className="mt-6 space-y-6">
            {showAIExplanations && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="bg-primary/5 border-primary/20">
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-primary/10 p-2 rounded-full">
                        <Sparkles className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-medium mb-1">
                          How AI Stock Recommendations Work
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Our AI analyzes thousands of data points including
                          financial metrics, market trends, news sentiment, and
                          technical indicators to generate personalized stock
                          recommendations. Each stock receives an AI Score
                          (0-100) based on its potential alignment with your
                          investment goals and risk tolerance.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Top Recommendations</h2>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {recommendations.map((stock) => (
                <motion.div
                  key={stock.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                  className="transition-all duration-300"
                >
                  <Card className="overflow-hidden h-full border-primary/10 hover:border-primary/30 hover:shadow-md transition-all duration-300">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-lg">
                              {stock.stock_name}
                            </CardTitle>
                            <Badge
                              variant="outline"
                              className="bg-green-500/10 text-green-500 dark:bg-green-500/20"
                            >
                              Recommended
                            </Badge>
                          </div>
                          <CardDescription className="line-clamp-1">
                            {stock.stock_name}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                          <Zap className="h-3.5 w-3.5 text-primary" />
                          <span className="text-xs font-medium">
                            {Math.floor(Math.random() * 20) + 80}/100
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pb-3">
                      <div className="flex justify-between items-center mb-3">
                        <div className="text-2xl font-bold">
                          ₹{(Math.random() * 500 + 100).toFixed(2)}
                        </div>
                        <div className="flex items-center text-green-500">
                          <ArrowUpRight className="h-4 w-4 mr-1" />
                          <span>
                            +{(Math.random() * 5).toFixed(2)} (+
                            {(Math.random() * 3).toFixed(2)}%)
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <div className="text-sm font-medium mb-1">
                            Why We Recommend
                          </div>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {stock.suggestion}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="rounded-md border p-2">
                            <div className="text-muted-foreground mb-1">
                              Category
                            </div>
                            <div className="font-medium">{stock.notes}</div>
                          </div>
                          <div className="rounded-md border p-2">
                            <div className="text-muted-foreground mb-1">
                              Risk Level
                            </div>
                            <div className="font-medium">
                              {stock.notes.includes("large") ? "Low" : "Medium"}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          <Badge variant="secondary" className="text-xs">
                            {stock.notes}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Investment {stock.investment}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter className="pt-0">
                      {/* <Button
                        variant="ghost"
                        className="w-full justify-between hover:bg-primary/10 transition-colors duration-300"
                        onClick={() =>
                          setSelectedStock(
                            selectedStock === stock.stock_name
                              ? null
                              : stock.stock_name
                          )
                        }
                      >
                        <span>View Details</span>
                        <ChevronRight
                          className={`h-4 w-4 transition-transform duration-300 ${
                            selectedStock === stock.stock_name
                              ? "rotate-90"
                              : ""
                          }`}
                        />
                      </Button> */}
                    </CardFooter>

                    <AnimatePresence>
                      {selectedStock === stock.stock_name && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-0">
                            <Separator className="mb-4" />
                            <div className="space-y-4">
                              <div>
                                <h4 className="text-sm font-medium mb-1">
                                  Detailed Analysis
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                  {stock.suggestion}
                                </p>
                              </div>

                              <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="rounded-md border p-2">
                                  <div className="text-muted-foreground mb-1">
                                    Category
                                  </div>
                                  <div className="font-medium">
                                    {stock.notes}
                                  </div>
                                </div>
                                <div className="rounded-md border p-2">
                                  <div className="text-muted-foreground mb-1">
                                    Investment ID
                                  </div>
                                  <div className="font-medium">
                                    {stock.investment}
                                  </div>
                                </div>
                              </div>

                              <div className="flex justify-between gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1"
                                >
                                  <Star className="h-4 w-4 mr-2" />
                                  Add to Watchlist
                                </Button>
                                <Button size="sm" className="flex-1">
                                  View Stock
                                  <ArrowRight className="h-4 w-4 ml-2" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
