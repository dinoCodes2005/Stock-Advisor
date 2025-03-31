"use client";

import type React from "react";

import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  BarChart3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { StockDetail } from "@/components/stocks/stock-detail";
import { StockCandlestickChart } from "@/components/stocks/stock-candlestick-chart";
import { motion, AnimatePresence } from "framer-motion";
import useWebSocket from "@/hooks/web-socket";

// Update the Stock interface to match the WebSocket data format
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

// Update the fallback data to match the WebSocket format
const fallbackData: Record<string, Stock> = {
  RELIANCE: {
    symbol: "RELIANCE",
    name: "Reliance Industries Ltd.",
    lastPrice: 2883.15,
    open: 2890.0,
    high: 2904.8,
    low: 2878.0,
    previousClose: 2910.05,
    sector: "Energy",
  },
  TCS: {
    symbol: "TCS",
    name: "Tata Consultancy Services Ltd.",
    lastPrice: 3877.5,
    open: 3875.0,
    high: 3946.7,
    low: 3871.45,
    previousClose: 3910.9,
    sector: "Technology",
  },
  INFY: {
    symbol: "INFY",
    name: "Infosys Ltd.",
    lastPrice: 1492.65,
    open: 1492.0,
    high: 1507.45,
    low: 1487.9,
    previousClose: 1508.85,
    sector: "Technology",
  },
  HDFCBANK: {
    symbol: "HDFCBANK",
    name: "HDFC Bank Ltd.",
    lastPrice: 1425.4,
    open: 1427.2,
    high: 1437.95,
    low: 1422.15,
    previousClose: 1442.85,
    sector: "Financial Services",
  },
  HDFC: {
    symbol: "HDFC",
    name: "Housing Development Finance Corporation Ltd.",
    lastPrice: 0,
    open: 0,
    high: 0,
    low: 0,
    previousClose: 0,
    sector: "Financial Services",
  },
  ICICIBANK: {
    symbol: "ICICIBANK",
    name: "ICICI Bank Ltd.",
    lastPrice: 1083.7,
    open: 1081.0,
    high: 1089.15,
    low: 1076.95,
    previousClose: 1090.3,
    sector: "Financial Services",
  },
  BHARTIARTL: {
    symbol: "BHARTIARTL",
    name: "Bharti Airtel Ltd.",
    lastPrice: 1213.4,
    open: 1215.0,
    high: 1234.0,
    low: 1210.0,
    previousClose: 1236.1,
    sector: "Communication Services",
  },
  KOTAKBANK: {
    symbol: "KOTAKBANK",
    name: "Kotak Mahindra Bank Ltd.",
    lastPrice: 1753.7,
    open: 1765.0,
    high: 1775.4,
    low: 1750.0,
    previousClose: 1776.4,
    sector: "Financial Services",
  },
  LT: {
    symbol: "LT",
    name: "Larsen & Toubro Ltd.",
    lastPrice: 3670.1,
    open: 3605.0,
    high: 3676.9,
    low: 3600.0,
    previousClose: 3617.8,
    sector: "Industrials",
  },
  ITC: {
    symbol: "ITC",
    name: "ITC Ltd.",
    lastPrice: 427.65,
    open: 425.55,
    high: 429.2,
    low: 425.55,
    previousClose: 428.6,
    sector: "Consumer Goods",
  },
};

// Update the component to use the WebSocket data or fallback data
export function StockList() {
  const realtimeData = useWebSocket("ws://localhost:8000/ws/data/");
  const [sortField, setSortField] = useState<keyof Stock>("lastPrice");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [stockData, setStockData] =
    useState<Record<string, Stock>>(fallbackData);
  const [chartStock, setChartStock] = useState<Stock | null>(null);
  const [isChartOpen, setIsChartOpen] = useState(false);

  useEffect(() => {
    console.log("Realtime Data", realtimeData);
    if (realtimeData?.data && Object.keys(realtimeData.data).length > 0) {
      setStockData(realtimeData.data);
    }
  }, [realtimeData]);

  const handleSort = (field: keyof Stock) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedStocks = Object.values(stockData).sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null || aValue === undefined)
      return sortDirection === "asc" ? -1 : 1;
    if (bValue === null || bValue === undefined)
      return sortDirection === "asc" ? 1 : -1;

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return sortDirection === "asc"
      ? (aValue as number) - (bValue as number)
      : (bValue as number) - (aValue as number);
  });

  const SortIcon = ({ field }: { field: keyof Stock }) => {
    if (sortField !== field)
      return <ChevronDown className="h-4 w-4 opacity-50" />;
    return sortDirection === "asc" ? (
      <ChevronUp className="h-4 w-4" />
    ) : (
      <ChevronDown className="h-4 w-4" />
    );
  };

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
  };

  const handleChartClick = (e: React.MouseEvent, stock: Stock) => {
    e.stopPropagation();
    setChartStock(stock);
    setIsChartOpen(true);
  };

  // Calculate price change and percentage
  const calculateChange = (stock: Stock) => {
    const change = stock.lastPrice - stock.previousClose;
    const changePercent = (change / stock.previousClose) * 100;
    return { change, changePercent };
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {selectedStock ? (
          <motion.div
            key="stock-detail"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <StockDetail
              symbol={selectedStock.symbol}
              name={selectedStock.name || selectedStock.symbol}
              price={selectedStock.lastPrice}
              change={calculateChange(selectedStock).change}
              changePercent={calculateChange(selectedStock).changePercent}
              onBack={() => setSelectedStock(null)}
            />
          </motion.div>
        ) : (
          <motion.div
            key="stock-list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className={isChartOpen ? "blur-sm" : ""}
          >
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 p-0 h-auto font-medium"
                            onClick={() => handleSort("symbol")}
                          >
                            Symbol
                            <SortIcon field="symbol" />
                          </Button>
                        </TableHead>

                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                            onClick={() => handleSort("lastPrice")}
                          >
                            Last Price
                            <SortIcon field="lastPrice" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right">
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                            onClick={() => handleSort("open")}
                          >
                            Open
                            <SortIcon field="open" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right hidden md:table-cell">
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                            onClick={() => handleSort("high")}
                          >
                            High
                            <SortIcon field="high" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right hidden md:table-cell">
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                            onClick={() => handleSort("low")}
                          >
                            Low
                            <SortIcon field="low" />
                          </Button>
                        </TableHead>
                        <TableHead className="text-right hidden lg:table-cell">
                          <Button
                            variant="ghost"
                            className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                            onClick={() => handleSort("previousClose")}
                          >
                            Prev Close
                            <SortIcon field="previousClose" />
                          </Button>
                        </TableHead>
                        <TableHead className="w-[100px]"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedStocks.map((stock) => {
                        const { change, changePercent } =
                          calculateChange(stock);
                        return (
                          <TableRow
                            key={stock.symbol}
                            className="cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => handleStockClick(stock)}
                          >
                            <TableCell className="font-medium">
                              {stock.symbol}
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{stock.lastPrice.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right">
                              ₹{stock.open.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right hidden md:table-cell">
                              ₹{stock.high.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right hidden md:table-cell">
                              ₹{stock.low.toFixed(2)}
                            </TableCell>
                            <TableCell className="text-right hidden lg:table-cell">
                              ₹{stock.previousClose.toFixed(2)}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <div
                                  className={`flex items-center justify-end ${
                                    change >= 0
                                      ? "text-green-500"
                                      : "text-red-500"
                                  }`}
                                >
                                  <span>
                                    {change >= 0 ? "+" : ""}
                                    {change.toFixed(2)}
                                  </span>
                                  {change >= 0 ? (
                                    <ArrowUpRight className="h-4 w-4 ml-1" />
                                  ) : (
                                    <ArrowDownRight className="h-4 w-4 ml-1" />
                                  )}
                                </div>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 hover:bg-primary/10 transition-colors"
                                  onClick={(e) => handleChartClick(e, stock)}
                                >
                                  <BarChart3 className="h-4 w-4" />
                                  <span className="sr-only">View chart</span>
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="py-4 border-t">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious href="#" />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive>
                          1
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">2</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#">3</PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext href="#" />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {chartStock && (
        <StockCandlestickChart
          stock={chartStock}
          isOpen={isChartOpen}
          onClose={() => {
            setIsChartOpen(false);
            setChartStock(null);
          }}
        />
      )}
    </>
  );
}
