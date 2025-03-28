"use client";

import { useState } from "react";
import {
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  ChevronUp,
  Star,
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
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  marketCap: string;
  peRatio: number | null;
  sector: string;
}

export function StockList() {
  const [sortField, setSortField] = useState<keyof Stock>("marketCap");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

  // const top50Stocks = [
  //   "AAPL",
  //   "MSFT",
  //   "GOOGL",
  //   "AMZN",
  //   "META",
  //   "TSLA",
  //   "BRK.B",
  //   "V",
  //   "JNJ",
  //   "WMT",
  //   "JPM",
  //   "NVDA",
  //   "PG",
  //   "HD",
  //   "DIS",
  //   "MA",
  //   "PYPL",
  //   "NFLX",
  //   "ADBE",
  //   "INTC",
  //   "KO",
  //   "PEP",
  //   "CSCO",
  //   "VZ",
  //   "MRK",
  //   "XOM",
  //   "NKE",
  //   "PFE",
  //   "ABT",
  //   "CRM",
  //   "ACN",
  //   "ABBV",
  //   "T",
  //   "CVX",
  //   "MCD",
  //   "COST",
  //   "LLY",
  //   "MDT",
  //   "CMCSA",
  //   "TXN",
  //   "NEE",
  //   "UNP",
  //   "BMY",
  //   "LIN",
  //   "PM",
  //   "HON",
  //   "IBM",
  //   "GE",
  //   "ORCL",
  //   "AMGN",
  //   "AVGO",
  // ];

  // const apiKey = "DNybQbLn8OnRbqdemzTIagUxf2A4O3SL";
  // (async function fetchTop50Stocks() {
  //   const url = `https://api.polygon.io/v2/snapshot/locale/us/markets/stocks/tickers?apiKey=${apiKey}`;

  //   try {
  //     const response = await axios.get(url);
  //     const data = response.data;
  //     console.log(data);
  //   } catch (error) {
  //     console.error("Error fetching top 50 stock data:", error);
  //   }
  // })();

  // Mock stock data
  const stocks: Stock[] = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: 187.32,
      change: 2.45,
      changePercent: 1.32,
      volume: "52.3M",
      marketCap: "2.94T",
      peRatio: 30.8,
      sector: "Technology",
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: 378.85,
      change: 4.21,
      changePercent: 1.12,
      volume: "21.7M",
      marketCap: "2.82T",
      peRatio: 36.5,
      sector: "Technology",
    },
    {
      symbol: "GOOGL",
      name: "Alphabet Inc.",
      price: 142.56,
      change: 1.23,
      changePercent: 0.87,
      volume: "18.9M",
      marketCap: "1.79T",
      peRatio: 25.3,
      sector: "Technology",
    },
    {
      symbol: "AMZN",
      name: "Amazon.com Inc.",
      price: 178.23,
      change: 3.45,
      changePercent: 1.97,
      volume: "32.1M",
      marketCap: "1.85T",
      peRatio: 61.2,
      sector: "Consumer Cyclical",
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: 245.67,
      change: -3.89,
      changePercent: -1.56,
      volume: "98.4M",
      marketCap: "780.5B",
      peRatio: 70.1,
      sector: "Automotive",
    },
    {
      symbol: "META",
      name: "Meta Platforms Inc.",
      price: 472.89,
      change: 8.76,
      changePercent: 1.89,
      volume: "15.6M",
      marketCap: "1.21T",
      peRatio: 32.4,
      sector: "Technology",
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      price: 487.21,
      change: 12.34,
      changePercent: 2.6,
      volume: "42.8M",
      marketCap: "1.20T",
      peRatio: 72.6,
      sector: "Technology",
    },
    {
      symbol: "JNJ",
      name: "Johnson & Johnson",
      price: 156.78,
      change: -0.45,
      changePercent: -0.29,
      volume: "5.7M",
      marketCap: "378.2B",
      peRatio: 15.8,
      sector: "Healthcare",
    },
    {
      symbol: "V",
      name: "Visa Inc.",
      price: 267.89,
      change: 1.23,
      changePercent: 0.46,
      volume: "6.3M",
      marketCap: "548.7B",
      peRatio: 31.2,
      sector: "Financial Services",
    },
    {
      symbol: "PG",
      name: "Procter & Gamble Co.",
      price: 156.34,
      change: 0.87,
      changePercent: 0.56,
      volume: "4.9M",
      marketCap: "368.5B",
      peRatio: 25.7,
      sector: "Consumer Defensive",
    },
  ];

  const handleSort = (field: keyof Stock) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedStocks = [...stocks].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (aValue === null) return sortDirection === "asc" ? -1 : 1;
    if (bValue === null) return sortDirection === "asc" ? 1 : -1;

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

  return (
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
            name={selectedStock.name}
            price={selectedStock.price}
            change={selectedStock.change}
            changePercent={selectedStock.changePercent}
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
                      <TableHead>
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 p-0 h-auto font-medium"
                          onClick={() => handleSort("name")}
                        >
                          Name
                          <SortIcon field="name" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                          onClick={() => handleSort("price")}
                        >
                          Price
                          <SortIcon field="price" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                          onClick={() => handleSort("changePercent")}
                        >
                          Change
                          <SortIcon field="changePercent" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                          onClick={() => handleSort("marketCap")}
                        >
                          Market Cap
                          <SortIcon field="marketCap" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right hidden md:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                          onClick={() => handleSort("peRatio")}
                        >
                          P/E Ratio
                          <SortIcon field="peRatio" />
                        </Button>
                      </TableHead>
                      <TableHead className="text-right hidden lg:table-cell">
                        <Button
                          variant="ghost"
                          className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                          onClick={() => handleSort("sector")}
                        >
                          Sector
                          <SortIcon field="sector" />
                        </Button>
                      </TableHead>
                      <TableHead className="w-[100px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sortedStocks.map((stock) => (
                      <TableRow
                        key={stock.symbol}
                        className="cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => handleStockClick(stock)}
                      >
                        <TableCell className="font-medium">
                          {stock.symbol}
                        </TableCell>
                        <TableCell>{stock.name}</TableCell>
                        <TableCell className="text-right">
                          ${stock.price.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className={`flex items-center justify-end ${
                              stock.change >= 0
                                ? "text-green-500"
                                : "text-red-500"
                            }`}
                          >
                            <span>
                              {stock.change >= 0 ? "+" : ""}
                              {stock.change.toFixed(2)}
                            </span>
                            <span className="ml-1">
                              ({stock.change >= 0 ? "+" : ""}
                              {stock.changePercent.toFixed(2)}%)
                            </span>
                            {stock.change >= 0 ? (
                              <ArrowUpRight className="h-4 w-4 ml-1" />
                            ) : (
                              <ArrowDownRight className="h-4 w-4 ml-1" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          ${stock.marketCap}
                        </TableCell>
                        <TableCell className="text-right hidden md:table-cell">
                          {stock.peRatio ? stock.peRatio.toFixed(1) : "N/A"}
                        </TableCell>
                        <TableCell className="text-right hidden lg:table-cell">
                          {stock.sector}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                // Add to watchlist functionality would go here
                              }}
                            >
                              <Star className="h-4 w-4" />
                              <span className="sr-only">Add to watchlist</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStockClick(stock);
                              }}
                            >
                              <BarChart3 className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
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
  );
}
