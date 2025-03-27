"use client"

import type React from "react"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { StockList } from "@/components/stocks/stock-list"
import { StockFilter } from "@/components/stocks/stock-filter"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Filter } from "lucide-react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useMobile } from "@/hooks/use-mobile"

export default function StocksPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const isMobile = useMobile()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would trigger a search API call
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Stocks</h1>
          <p className="text-muted-foreground">
            Browse, search, and filter stocks to find the perfect additions to your portfolio.
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-4 items-start">
          <div className="w-full md:w-3/4 space-y-6">
            <div className="flex gap-2">
              <form onSubmit={handleSearch} className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search stocks by name or symbol..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>

              {isMobile ? (
                <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Filter className="h-4 w-4" />
                      <span className="sr-only">Filter</span>
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right">
                    <div className="py-4">
                      <h3 className="text-lg font-medium mb-4">Filters</h3>
                      <StockFilter />
                    </div>
                  </SheetContent>
                </Sheet>
              ) : null}
            </div>

            <StockList />
          </div>

          {!isMobile && (
            <div className="w-full md:w-1/4 sticky top-20">
              <div className="border rounded-lg p-4">
                <h3 className="text-lg font-medium mb-4">Filters</h3>
                <StockFilter />
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

