"use client"

import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface TrendingStock {
  symbol: string
  name: string
  price: string
  change: string
  changePercent: string
  isPositive: boolean
}

export function TrendingStocks() {
  // Mock data for trending stocks
  const trendingStocks: TrendingStock[] = [
    {
      symbol: "AAPL",
      name: "Apple Inc.",
      price: "187.32",
      change: "+2.45",
      changePercent: "1.32%",
      isPositive: true,
    },
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: "378.85",
      change: "+4.21",
      changePercent: "1.12%",
      isPositive: true,
    },
    {
      symbol: "TSLA",
      name: "Tesla Inc.",
      price: "245.67",
      change: "-3.89",
      changePercent: "1.56%",
      isPositive: false,
    },
    {
      symbol: "NVDA",
      name: "NVIDIA Corp.",
      price: "487.21",
      change: "+12.34",
      changePercent: "2.60%",
      isPositive: true,
    },
  ]

  return (
    <div className="space-y-4">
      {trendingStocks.map((stock) => (
        <div key={stock.symbol} className="flex items-center justify-between">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-medium">{stock.symbol}</span>
              <span className="text-xs text-muted-foreground">{stock.name}</span>
            </div>
            <span className="text-sm">${stock.price}</span>
          </div>
          <div className={`flex items-center ${stock.isPositive ? "text-green-500" : "text-red-500"}`}>
            <span className="text-sm font-medium">{stock.change}</span>
            <span className="text-xs ml-1">({stock.changePercent})</span>
            {stock.isPositive ? <ArrowUpRight className="h-4 w-4 ml-1" /> : <ArrowDownRight className="h-4 w-4 ml-1" />}
          </div>
        </div>
      ))}
    </div>
  )
}

