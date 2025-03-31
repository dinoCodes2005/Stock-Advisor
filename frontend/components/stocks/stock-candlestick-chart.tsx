"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  ReferenceLine,
} from "recharts";

interface Stock {
  symbol: string;
  name?: string;
  lastPrice: number;
  open: number;
  high: number;
  low: number;
  previousClose: number;
  sector?: string;
}

interface CandlestickChartProps {
  stock: Stock;
  isOpen: boolean;
  onClose: () => void;
}

// Generate historical data for the candlestick chart
const generateHistoricalData = (stock: Stock, days = 30) => {
  const data = [];
  const today = new Date();

  // Start with the current stock price
  let prevClose = stock.previousClose;
  let prevHigh = stock.high;
  let prevLow = stock.low;
  let prevOpen = stock.open;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(today.getDate() - i);

    // Generate realistic price movements
    const volatility = 0.02; // 2% daily volatility
    const randomChange = (Math.random() - 0.5) * volatility * prevClose;

    // Calculate new prices with some randomness but maintain trend
    const open =
      i === 0
        ? stock.open
        : prevClose + (Math.random() - 0.5) * volatility * prevClose;
    const close = open + randomChange;
    const high = Math.max(open, close) + Math.random() * volatility * prevClose;
    const low = Math.min(open, close) - Math.random() * volatility * prevClose;

    // Calculate volume (higher on big price moves)
    const volumeFactor = (Math.abs(close - open) / open) * 10;
    const volume = Math.floor(
      100000 + Math.random() * 900000 * (1 + volumeFactor)
    );

    data.push({
      date: format(date, "yyyy-MM-dd"),
      open: Number.parseFloat(open.toFixed(2)),
      close: Number.parseFloat(close.toFixed(2)),
      high: Number.parseFloat(high.toFixed(2)),
      low: Number.parseFloat(low.toFixed(2)),
      volume,
    });

    // Set previous values for next iteration
    prevClose = close;
    prevHigh = high;
    prevLow = low;
    prevOpen = open;
  }

  return data;
};

export function StockCandlestickChart({
  stock,
  isOpen,
  onClose,
}: CandlestickChartProps) {
  const [timeframe, setTimeframe] = useState("1M");
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    if (stock) {
      // Generate different amounts of data based on timeframe
      const days =
        timeframe === "1W"
          ? 7
          : timeframe === "1M"
          ? 30
          : timeframe === "3M"
          ? 90
          : 180;
      setChartData(generateHistoricalData(stock, days));
    }
  }, [stock, timeframe]);

  if (!stock) return null;

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-background border rounded-md shadow-md p-3 text-xs">
          <p className="font-medium">{label}</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 mt-2">
            <span className="text-muted-foreground">Open:</span>
            <span className="font-medium">₹{data.open}</span>
            <span className="text-muted-foreground">Close:</span>
            <span
              className={`font-medium ${
                data.close >= data.open ? "text-green-500" : "text-red-500"
              }`}
            >
              ₹{data.close}
            </span>
            <span className="text-muted-foreground">High:</span>
            <span className="font-medium">₹{data.high}</span>
            <span className="text-muted-foreground">Low:</span>
            <span className="font-medium">₹{data.low}</span>
            <span className="text-muted-foreground">Volume:</span>
            <span className="font-medium">{data.volume.toLocaleString()}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 h-[80vh] max-h-[800px] overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                {stock.symbol}
                <span className="text-base font-normal text-muted-foreground">
                  {stock.name}
                </span>
              </DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-2xl font-semibold">
                  ₹{stock.lastPrice.toFixed(2)}
                </span>
                <span
                  className={`flex items-center text-sm ${
                    stock.lastPrice >= stock.previousClose
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stock.lastPrice >= stock.previousClose ? "+" : ""}
                  {(stock.lastPrice - stock.previousClose).toFixed(2)}(
                  {(
                    ((stock.lastPrice - stock.previousClose) /
                      stock.previousClose) *
                    100
                  ).toFixed(2)}
                  %)
                </span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="p-6 pt-2">
          <div className="flex items-center justify-between mb-4">
            <Tabs defaultValue="candlestick" className="w-[300px]">
              <TabsList>
                <TabsTrigger value="candlestick">Candlestick</TabsTrigger>
                <TabsTrigger value="line">Line</TabsTrigger>
                <TabsTrigger value="area">Area</TabsTrigger>
              </TabsList>
            </Tabs>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeframe("1W")}
                className={
                  timeframe === "1W" ? "bg-primary text-primary-foreground" : ""
                }
              >
                1W
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeframe("1M")}
                className={
                  timeframe === "1M" ? "bg-primary text-primary-foreground" : ""
                }
              >
                1M
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeframe("3M")}
                className={
                  timeframe === "3M" ? "bg-primary text-primary-foreground" : ""
                }
              >
                3M
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTimeframe("6M")}
                className={
                  timeframe === "6M" ? "bg-primary text-primary-foreground" : ""
                }
              >
                6M
              </Button>
            </div>
          </div>

          <div className="h-[calc(100%-120px)] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return format(date, "dd MMM");
                  }}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  yAxisId="price"
                  domain={["auto", "auto"]}
                  tickFormatter={(value) => `₹${value}`}
                  tick={{ fontSize: 12 }}
                  width={60}
                />
                <YAxis
                  yAxisId="volume"
                  orientation="right"
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}K`}
                  domain={["auto", "auto"]}
                  tick={{ fontSize: 12 }}
                  width={60}
                  opacity={0.5}
                />
                <Tooltip content={<CustomTooltip />} />

                {/* Candlestick representation */}
                <Bar
                  dataKey="shadowHeight"
                  fill="transparent"
                  stroke="#8884d8"
                  yAxisId="price"
                  barSize={8}
                  shape={(props: any) => {
                    const { x, y, width, height, datum } = props;
                    const open = datum.open;
                    const close = datum.close;
                    const high = datum.high;
                    const low = datum.low;

                    // Calculate positions
                    const yHigh = props.yAxis.scale(high);
                    const yLow = props.yAxis.scale(low);
                    const yOpen = props.yAxis.scale(open);
                    const yClose = props.yAxis.scale(close);

                    const isRising = close >= open;
                    const color = isRising ? "#22c55e" : "#ef4444";
                    const barHeight = Math.abs(yClose - yOpen);

                    return (
                      <g>
                        {/* Wick line (high to low) */}
                        <line
                          x1={x + width / 2}
                          y1={yHigh}
                          x2={x + width / 2}
                          y2={yLow}
                          stroke={color}
                          strokeWidth={1}
                        />
                        {/* Candle body */}
                        <rect
                          x={x}
                          y={isRising ? yClose : yOpen}
                          width={width}
                          height={barHeight || 1} // Ensure at least 1px height
                          fill={isRising ? "#22c55e" : "#ef4444"}
                          stroke={color}
                        />
                      </g>
                    );
                  }}
                />

                {/* Volume bars at the bottom */}
                <Bar
                  dataKey="volume"
                  fill="rgba(100, 100, 255, 0.3)"
                  yAxisId="volume"
                  barSize={20}
                  opacity={0.3}
                />

                {/* Reference line for previous close */}
                <ReferenceLine
                  y={stock.previousClose}
                  stroke="#888"
                  strokeDasharray="3 3"
                  yAxisId="price"
                  label={{
                    value: `Prev Close: ₹${stock.previousClose}`,
                    position: "insideBottomRight",
                    fill: "#888",
                    fontSize: 12,
                  }}
                />

                {/* Moving averages */}
                <Line
                  type="monotone"
                  dataKey="ma20"
                  stroke="#8884d8"
                  dot={false}
                  strokeWidth={1.5}
                  yAxisId="price"
                />
                <Line
                  type="monotone"
                  dataKey="ma50"
                  stroke="#82ca9d"
                  dot={false}
                  strokeWidth={1.5}
                  yAxisId="price"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Open</div>
                <div className="text-lg font-semibold">
                  ₹{stock.open.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">High</div>
                <div className="text-lg font-semibold">
                  ₹{stock.high.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Low</div>
                <div className="text-lg font-semibold">
                  ₹{stock.low.toFixed(2)}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <div className="text-xs text-muted-foreground">Prev Close</div>
                <div className="text-lg font-semibold">
                  ₹{stock.previousClose.toFixed(2)}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
