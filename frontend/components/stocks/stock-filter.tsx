"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Separator } from "@/components/ui/separator"
import { Loader2 } from "lucide-react"

export function StockFilter() {
  const [isLoading, setIsLoading] = useState(false)
  const [priceRange, setPriceRange] = useState([0, 500])

  const sectors = [
    "Technology",
    "Healthcare",
    "Financial Services",
    "Consumer Cyclical",
    "Communication Services",
    "Industrials",
    "Consumer Defensive",
    "Energy",
    "Basic Materials",
    "Real Estate",
    "Utilities",
  ]

  const handleApplyFilters = () => {
    setIsLoading(true)

    // Simulate API call to apply filters
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }

  const handleResetFilters = () => {
    setPriceRange([0, 500])
    // Reset other filters
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h4 className="text-sm font-medium">Price Range</h4>
        <Slider defaultValue={[0, 500]} max={1000} step={10} value={priceRange} onValueChange={setPriceRange} />
        <div className="flex items-center justify-between">
          <span className="text-sm">${priceRange[0]}</span>
          <span className="text-sm">${priceRange[1]}</span>
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Market Cap</h4>
        <div className="space-y-2">
          {["Mega ($200B+)", "Large ($10-200B)", "Mid ($2-10B)", "Small ($300M-2B)", "Micro (< $300M)"].map((cap) => (
            <div key={cap} className="flex items-center space-x-2">
              <Checkbox id={`cap-${cap.split(" ")[0].toLowerCase()}`} />
              <Label htmlFor={`cap-${cap.split(" ")[0].toLowerCase()}`} className="text-sm font-normal">
                {cap}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Sectors</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
          {sectors.map((sector) => (
            <div key={sector} className="flex items-center space-x-2">
              <Checkbox id={`sector-${sector.toLowerCase().replace(/\s+/g, "-")}`} />
              <Label htmlFor={`sector-${sector.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm font-normal">
                {sector}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-4">
        <h4 className="text-sm font-medium">Performance</h4>
        <div className="space-y-2">
          {["Positive Today", "Positive This Week", "Positive This Month", "Positive This Year"].map((perf) => (
            <div key={perf} className="flex items-center space-x-2">
              <Checkbox id={`perf-${perf.toLowerCase().replace(/\s+/g, "-")}`} />
              <Label htmlFor={`perf-${perf.toLowerCase().replace(/\s+/g, "-")}`} className="text-sm font-normal">
                {perf}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2">
        <Button onClick={handleApplyFilters} className="flex-1" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Applying...
            </>
          ) : (
            "Apply Filters"
          )}
        </Button>
        <Button variant="outline" onClick={handleResetFilters} className="flex-1">
          Reset
        </Button>
      </div>
    </div>
  )
}

