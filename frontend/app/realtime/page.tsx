"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, ArrowDownRight, RefreshCw } from "lucide-react"
import { StockChart } from "@/components/stocks/stock-chart"

export default function RealtimePage() {
  const [activeTab, setActiveTab] = useState("market")
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())
  const [isMounted, setIsMounted] = useState(false)

  const refreshData = () => {
    setIsLoading(true)

    // Simulate API call to refresh data
    setTimeout(() => {
      setIsLoading(false)
      setLastUpdated(new Date())
    }, 1000)
  }

  useEffect(() => {
    // Mark component as mounted to avoid hydration issues
    setIsMounted(true)

    // Initial data load
    refreshData()

    // Set up auto-refresh every 60 seconds
    const interval = setInterval(() => {
      refreshData()
    }, 60000)

    return () => clearInterval(interval)
  }, [])

  // Prevent hydration issues by not rendering until mounted
  if (!isMounted) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[80vh]">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Real-time Market Data</h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Last updated: {lastUpdated.toLocaleTimeString()}</span>
              <Button variant="outline" size="icon" onClick={refreshData} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
                <span className="sr-only">Refresh data</span>
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">Monitor real-time market data, indices, and stock performance.</p>
        </div>

        <Tabs defaultValue="market" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="market">Market Overview</TabsTrigger>
            <TabsTrigger value="indices">Indices</TabsTrigger>
            <TabsTrigger value="stocks">Stocks</TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                { name: "S&P 500", value: "4,587.64", change: "+0.63%", isPositive: true },
                { name: "NASDAQ", value: "14,346.02", change: "+0.83%", isPositive: true },
                { name: "DOW", value: "36,124.56", change: "+0.34%", isPositive: true },
                { name: "Russell 2000", value: "1,964.35", change: "-0.12%", isPositive: false },
                { name: "VIX", value: "18.24", change: "-2.45%", isPositive: false },
                { name: "10-Year Treasury", value: "4.32%", change: "+0.05%", isPositive: true },
              ].map((index) => (
                <Card key={index.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{index.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold">{index.value}</span>
                      <div className={`flex items-center ${index.isPositive ? "text-green-500" : "text-red-500"}`}>
                        <span className="font-medium">{index.change}</span>
                        {index.isPositive ? (
                          <ArrowUpRight className="h-5 w-5 ml-1" />
                        ) : (
                          <ArrowDownRight className="h-5 w-5 ml-1" />
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Market Heatmap</CardTitle>
                  <CardDescription>Visual representation of market performance by sector.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 p-4 w-full h-full">
                      {[
                        { name: "Technology", change: "+1.2%", size: "large", isPositive: true },
                        { name: "Healthcare", change: "+0.5%", size: "medium", isPositive: true },
                        { name: "Financials", change: "+0.3%", size: "large", isPositive: true },
                        { name: "Consumer Discretionary", change: "-0.2%", size: "medium", isPositive: false },
                        { name: "Communication Services", change: "+0.8%", size: "medium", isPositive: true },
                        { name: "Industrials", change: "+0.1%", size: "small", isPositive: true },
                        { name: "Energy", change: "-1.5%", size: "medium", isPositive: false },
                        { name: "Utilities", change: "-0.3%", size: "small", isPositive: false },
                        { name: "Materials", change: "+0.4%", size: "small", isPositive: true },
                        { name: "Real Estate", change: "-0.7%", size: "small", isPositive: false },
                      ].map((sector) => {
                        const sizeClass =
                          sector.size === "large"
                            ? "col-span-1 md:col-span-2 row-span-2"
                            : sector.size === "medium"
                              ? "col-span-1 row-span-1 md:row-span-2"
                              : "col-span-1 row-span-1"

                        return (
                          <div
                            key={sector.name}
                            className={`${sizeClass} ${
                              sector.isPositive
                                ? "bg-green-500/10 border-green-500/20"
                                : "bg-red-500/10 border-red-500/20"
                            } border rounded-lg p-2 flex flex-col justify-between`}
                          >
                            <span className="text-xs font-medium truncate">{sector.name}</span>
                            <div
                              className={`text-sm font-bold ${sector.isPositive ? "text-green-500" : "text-red-500"}`}
                            >
                              {sector.change}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="indices" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Index Performance</CardTitle>
                    <Select defaultValue="1d">
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Time Period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1d">1 Day</SelectItem>
                        <SelectItem value="1w">1 Week</SelectItem>
                        <SelectItem value="1m">1 Month</SelectItem>
                        <SelectItem value="3m">3 Months</SelectItem>
                        <SelectItem value="1y">1 Year</SelectItem>
                        <SelectItem value="5y">5 Years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <StockChart type="line" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Global Indices</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "FTSE 100 (UK)", value: "7,487.64", change: "+0.43%", isPositive: true },
                      { name: "Nikkei 225 (Japan)", value: "32,156.89", change: "+1.21%", isPositive: true },
                      { name: "DAX (Germany)", value: "15,893.45", change: "+0.67%", isPositive: true },
                      { name: "Shanghai Composite", value: "3,124.67", change: "-0.32%", isPositive: false },
                      { name: "Hang Seng (Hong Kong)", value: "17,456.32", change: "-0.87%", isPositive: false },
                    ].map((index) => (
                      <div key={index.name} className="flex justify-between items-center">
                        <span className="font-medium">{index.name}</span>
                        <div className="flex items-center gap-2">
                          <span>{index.value}</span>
                          <span className={index.isPositive ? "text-green-500" : "text-red-500"}>{index.change}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Sector Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { name: "Technology", change: "+1.2%", isPositive: true },
                      { name: "Healthcare", change: "+0.5%", isPositive: true },
                      { name: "Financials", change: "+0.3%", isPositive: true },
                      { name: "Consumer Discretionary", change: "-0.2%", isPositive: false },
                      { name: "Energy", change: "-1.5%", isPositive: false },
                    ].map((sector) => (
                      <div key={sector.name} className="flex justify-between items-center">
                        <span className="font-medium">{sector.name}</span>
                        <span className={sector.isPositive ? "text-green-500" : "text-red-500"}>{sector.change}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="stocks" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="md:col-span-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Stock Comparison</CardTitle>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="AAPL">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Select Stock" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="AAPL">AAPL</SelectItem>
                          <SelectItem value="MSFT">MSFT</SelectItem>
                          <SelectItem value="GOOGL">GOOGL</SelectItem>
                          <SelectItem value="AMZN">AMZN</SelectItem>
                          <SelectItem value="TSLA">TSLA</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select defaultValue="1d">
                        <SelectTrigger className="w-[120px]">
                          <SelectValue placeholder="Time Period" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1d">1 Day</SelectItem>
                          <SelectItem value="1w">1 Week</SelectItem>
                          <SelectItem value="1m">1 Month</SelectItem>
                          <SelectItem value="3m">3 Months</SelectItem>
                          <SelectItem value="1y">1 Year</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px]">
                    <StockChart type="candlestick" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Most Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { symbol: "AAPL", name: "Apple Inc.", price: "$187.32", change: "+1.32%", volume: "52.3M" },
                      { symbol: "TSLA", name: "Tesla Inc.", price: "$245.67", change: "-1.56%", volume: "98.4M" },
                      { symbol: "NVDA", name: "NVIDIA Corp.", price: "$487.21", change: "+2.60%", volume: "42.8M" },
                      {
                        symbol: "AMD",
                        name: "Advanced Micro Devices",
                        price: "$123.45",
                        change: "+3.21%",
                        volume: "38.2M",
                      },
                      {
                        symbol: "PLTR",
                        name: "Palantir Technologies",
                        price: "$18.76",
                        change: "-2.34%",
                        volume: "45.6M",
                      },
                    ].map((stock) => (
                      <div key={stock.symbol} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{stock.symbol}</div>
                          <div className="text-xs text-muted-foreground">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div>{stock.price}</div>
                          <div className={stock.change.startsWith("+") ? "text-green-500" : "text-red-500"}>
                            {stock.change}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Gainers & Losers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Top Gainers</h4>
                    <div className="space-y-3">
                      {[
                        { symbol: "UPST", name: "Upstart Holdings", price: "$34.56", change: "+15.4%" },
                        { symbol: "RIVN", name: "Rivian Automotive", price: "$18.23", change: "+12.7%" },
                        { symbol: "RBLX", name: "Roblox Corp.", price: "$42.87", change: "+9.8%" },
                      ].map((stock) => (
                        <div key={stock.symbol} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-xs text-muted-foreground">{stock.name}</div>
                          </div>
                          <div className="text-right">
                            <div>{stock.price}</div>
                            <div className="text-green-500">{stock.change}</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="my-4 border-t"></div>

                    <h4 className="text-sm font-medium">Top Losers</h4>
                    <div className="space-y-3">
                      {[
                        { symbol: "BYND", name: "Beyond Meat Inc.", price: "$8.76", change: "-12.3%" },
                        { symbol: "CVNA", name: "Carvana Co.", price: "$45.32", change: "-8.7%" },
                        { symbol: "SNAP", name: "Snap Inc.", price: "$12.45", change: "-7.2%" },
                      ].map((stock) => (
                        <div key={stock.symbol} className="flex justify-between items-center">
                          <div>
                            <div className="font-medium">{stock.symbol}</div>
                            <div className="text-xs text-muted-foreground">{stock.name}</div>
                          </div>
                          <div className="text-right">
                            <div>{stock.price}</div>
                            <div className="text-red-500">{stock.change}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

