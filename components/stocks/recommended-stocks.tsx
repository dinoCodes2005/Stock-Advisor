"use client"

import { ArrowUpRight, ArrowDownRight, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface RecommendedStock {
  symbol: string
  name: string
  price: string
  change: string
  changePercent: string
  isPositive: boolean
  aiScore: number
  reason: string
}

export function RecommendedStocks() {
  // Mock data for AI-recommended stocks
  const recommendedStocks: RecommendedStock[] = [
    {
      symbol: "MSFT",
      name: "Microsoft Corp.",
      price: "378.85",
      change: "+4.21",
      changePercent: "1.12%",
      isPositive: true,
      aiScore: 92,
      reason:
        "Strong cloud growth, AI initiatives, and consistent dividend increases align with your growth and income preferences.",
    },
    {
      symbol: "COST",
      name: "Costco Wholesale",
      price: "654.32",
      change: "+2.87",
      changePercent: "0.44%",
      isPositive: true,
      aiScore: 89,
      reason:
        "Stable business model, strong consumer loyalty, and moderate growth match your balanced investment approach.",
    },
    {
      symbol: "ENPH",
      name: "Enphase Energy",
      price: "124.56",
      change: "+5.43",
      changePercent: "4.56%",
      isPositive: true,
      aiScore: 87,
      reason:
        "Leading position in renewable energy sector aligns with your ESG preferences and technology sector interest.",
    },
    {
      symbol: "V",
      name: "Visa Inc.",
      price: "267.89",
      change: "+1.23",
      changePercent: "0.46%",
      isPositive: true,
      aiScore: 85,
      reason:
        "Strong financial position, global presence, and consistent growth match your medium-term investment horizon.",
    },
    {
      symbol: "JNJ",
      name: "Johnson & Johnson",
      price: "156.78",
      change: "-0.45",
      changePercent: "0.29%",
      isPositive: false,
      aiScore: 83,
      reason:
        "Defensive healthcare stock with strong dividend history aligns with your income and stability preferences.",
    },
  ]

  return (
    <div className="space-y-4">
      {recommendedStocks.map((stock) => (
        <div key={stock.symbol} className="flex flex-col border rounded-lg p-4 hover:bg-muted/50 transition-colors">
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-medium text-lg">{stock.symbol}</span>
                <span className="text-sm text-muted-foreground">{stock.name}</span>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-base font-medium">${stock.price}</span>
                <div className={`flex items-center ml-2 ${stock.isPositive ? "text-green-500" : "text-red-500"}`}>
                  <span className="text-sm">{stock.change}</span>
                  <span className="text-xs ml-1">({stock.changePercent})</span>
                  {stock.isPositive ? (
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  ) : (
                    <ArrowDownRight className="h-4 w-4 ml-1" />
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                <div className="text-xs font-medium bg-primary/10 text-primary rounded-full px-2 py-1">
                  AI Score: {stock.aiScore}/100
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-6 w-6 ml-1">
                        <Info className="h-3 w-3" />
                        <span className="sr-only">AI Score Info</span>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      <p className="max-w-xs text-xs">
                        AI Score represents how well this stock matches your investment preferences.
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-1">{stock.reason}</p>
          <div className="flex justify-end mt-3">
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

