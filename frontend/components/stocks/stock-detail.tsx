"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, type UTCTimestamp } from "lightweight-charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Clock,
  Calendar,
  TrendingUp,
  BarChart3,
  LineChart,
} from "lucide-react";

interface CandlestickData {
  time: UTCTimestamp;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface StockDetailProps {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  onBack: () => void;
}

export function StockDetail({
  symbol,
  name,
  price,
  change,
  changePercent,
  onBack,
}: StockDetailProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const [chartPeriod, setChartPeriod] = useState<
    "1D" | "1W" | "1M" | "3M" | "1Y" | "5Y"
  >("1M");
  const [chartType, setChartType] = useState<"candle" | "line" | "area">(
    "candle"
  );
  const [isLoading, setIsLoading] = useState(true);

  // Generate mock candlestick data
  const generateMockData = (
    days: number,
    startPrice: number,
    volatility: number
  ): CandlestickData[] => {
    const data: CandlestickData[] = [];
    let currentPrice = startPrice;

    const now = new Date();
    const endDate = new Date(now);
    const startDate = new Date(now);
    startDate.setDate(now.getDate() - days);

    for (
      let date = new Date(startDate);
      date <= endDate;
      date.setDate(date.getDate() + 1)
    ) {
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const change = (Math.random() - 0.5) * volatility * currentPrice;
      const open = currentPrice;
      const close = open + change;
      const high =
        Math.max(open, close) + (Math.random() * volatility * currentPrice) / 2;
      const low =
        Math.min(open, close) - (Math.random() * volatility * currentPrice) / 2;

      data.push({
        time: (date.getTime() / 1000) as UTCTimestamp,
        open,
        high,
        low,
        close,
      });

      currentPrice = close;
    }

    return data;
  };

  useEffect(() => {
    if (!chartContainerRef.current) return;

    setIsLoading(true);

    // Clear previous chart
    chartContainerRef.current.innerHTML = "";

    // Create chart
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(100, 100, 100, 0.9)",
      },
      grid: {
        vertLines: { color: "rgba(197, 203, 206, 0.1)" },
        horzLines: { color: "rgba(197, 203, 206, 0.1)" },
      },
      width: chartContainerRef.current.clientWidth,
      height: 400,
      timeScale: {
        timeVisible: true,
        secondsVisible: false,
      },
    });

    // Add resize listener
    const handleResize = () => {
      if (chartContainerRef.current) {
        chart.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    window.addEventListener("resize", handleResize);

    // Determine data range based on selected period
    let days = 30;
    let volatility = 0.02;

    switch (chartPeriod) {
      case "1D":
        days = 1;
        volatility = 0.005;
        break;
      case "1W":
        days = 7;
        volatility = 0.01;
        break;
      case "1M":
        days = 30;
        volatility = 0.02;
        break;
      case "3M":
        days = 90;
        volatility = 0.025;
        break;
      case "1Y":
        days = 365;
        volatility = 0.03;
        break;
      case "5Y":
        days = 365 * 5;
        volatility = 0.04;
        break;
    }

    // Generate mock data
    const mockData = generateMockData(days, price, volatility);

    // Create series based on chart type
    if (chartType === "candle") {
      const candlestickSeries = chart.addCandlestickSeries({
        upColor: "#26a69a",
        downColor: "#ef5350",
        borderVisible: false,
        wickUpColor: "#26a69a",
        wickDownColor: "#ef5350",
      });
      candlestickSeries.setData(mockData);
    } else if (chartType === "line") {
      const lineSeries = chart.addLineSeries({
        color: "#2962FF",
        lineWidth: 2,
      });
      lineSeries.setData(
        mockData.map((item) => ({
          time: item.time,
          value: item.close,
        }))
      );
    } else if (chartType === "area") {
      const areaSeries = chart.addAreaSeries({
        topColor: "rgba(41, 98, 255, 0.3)",
        bottomColor: "rgba(41, 98, 255, 0.0)",
        lineColor: "rgba(41, 98, 255, 1)",
        lineWidth: 2,
      });
      areaSeries.setData(
        mockData.map((item) => ({
          time: item.time,
          value: item.close,
        }))
      );
    }

    // Fit content
    chart.timeScale().fitContent();

    setTimeout(() => {
      setIsLoading(false);
    }, 500);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [chartPeriod, chartType, price, symbol]);

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={onBack}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <CardTitle className="text-xl font-bold">{symbol}</CardTitle>
            <span className="text-muted-foreground">{name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold">${price.toFixed(2)}</span>
            <span
              className={`flex items-center ${
                change >= 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {change >= 0 ? "+" : ""}
              {change.toFixed(2)} ({change >= 0 ? "+" : ""}
              {changePercent.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <Tabs
            value={chartType}
            onValueChange={(value) => setChartType(value as any)}
          >
            <TabsList className="grid grid-cols-3 h-8">
              <TabsTrigger value="candle" className="text-xs px-2">
                <BarChart3 className="h-3.5 w-3.5 mr-1" />
                Candle
              </TabsTrigger>
              <TabsTrigger value="line" className="text-xs px-2">
                <LineChart className="h-3.5 w-3.5 mr-1" />
                Line
              </TabsTrigger>
              <TabsTrigger value="area" className="text-xs px-2">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                Area
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Button
              variant={chartPeriod === "1D" ? "default" : "outline"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setChartPeriod("1D")}
            >
              <Clock className="mr-1 h-3.5 w-3.5" />
              1D
            </Button>
            <Button
              variant={chartPeriod === "1W" ? "default" : "outline"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setChartPeriod("1W")}
            >
              1W
            </Button>
            <Button
              variant={chartPeriod === "1M" ? "default" : "outline"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setChartPeriod("1M")}
            >
              1M
            </Button>
            <Button
              variant={chartPeriod === "3M" ? "default" : "outline"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setChartPeriod("3M")}
            >
              3M
            </Button>
            <Button
              variant={chartPeriod === "1Y" ? "default" : "outline"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setChartPeriod("1Y")}
            >
              <Calendar className="mr-1 h-3.5 w-3.5" />
              1Y
            </Button>
            <Button
              variant={chartPeriod === "5Y" ? "default" : "outline"}
              size="sm"
              className="h-7 px-2.5 text-xs"
              onClick={() => setChartPeriod("5Y")}
            >
              5Y
            </Button>
          </div>
        </div>

        <div className="relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                <span className="text-sm text-muted-foreground">
                  Loading chart data...
                </span>
              </div>
            </div>
          )}
          <div ref={chartContainerRef} className="w-full h-[400px]" />
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Open</div>
            <div className="text-lg font-medium">
              ${(price - Math.random() * 2).toFixed(2)}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">High</div>
            <div className="text-lg font-medium">
              ${(price + Math.random() * 3).toFixed(2)}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Low</div>
            <div className="text-lg font-medium">
              ${(price - Math.random() * 3).toFixed(2)}
            </div>
          </div>
          <div className="rounded-lg border p-3">
            <div className="text-xs text-muted-foreground">Volume</div>
            <div className="text-lg font-medium">
              {Math.floor(Math.random() * 50) + 10}M
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
