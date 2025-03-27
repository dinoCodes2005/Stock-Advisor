"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { PreferenceForm } from "@/components/dashboard/preference-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingStocks } from "@/components/stocks/trending-stocks"
import { RecommendedStocks } from "@/components/stocks/recommended-stocks"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const [showRecommendations, setShowRecommendations] = useState(false)

  const handlePreferenceSubmit = () => {
    setShowRecommendations(true)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to your AI-powered investment dashboard. Set your preferences to get personalized stock
            recommendations.
          </p>
        </div>

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="preferences">Investment Preferences</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          <TabsContent value="preferences" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Investment Preferences</CardTitle>
                  <CardDescription>
                    Set your investment preferences to get personalized stock recommendations.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PreferenceForm onSubmit={handlePreferenceSubmit} />
                </CardContent>
              </Card>

              <div className="flex flex-col gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Trending Stocks</CardTitle>
                    <CardDescription>Popular stocks trending in the market today.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TrendingStocks />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Market Overview</CardTitle>
                    <CardDescription>Current market status and indices.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { name: "S&P 500", value: "4,587.64", change: "+0.63%" },
                        { name: "NASDAQ", value: "14,346.02", change: "+0.83%" },
                        { name: "DOW", value: "36,124.56", change: "+0.34%" },
                      ].map((index) => (
                        <div key={index.name} className="flex justify-between items-center">
                          <span className="font-medium">{index.name}</span>
                          <div className="flex items-center gap-2">
                            <span>{index.value}</span>
                            <span className={index.change.startsWith("+") ? "text-green-500" : "text-red-500"}>
                              {index.change}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6">
                      <Link href="/realtime">
                        <Button variant="outline" className="w-full">
                          View Real-time Data
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="recommendations" className="mt-6">
            {showRecommendations ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <CardTitle>AI-Powered Recommendations</CardTitle>
                    </div>
                    <CardDescription>
                      Based on your preferences, our AI suggests these stocks for your portfolio.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RecommendedStocks />
                  </CardContent>
                </Card>

                <div className="flex justify-end">
                  <Link href="/stocks">
                    <Button>
                      Explore All Stocks
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Recommendations Yet</h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Set your investment preferences first to get personalized AI-powered stock recommendations.
                </p>
                <Button onClick={() => document.querySelector('[data-value="preferences"]')?.click()}>
                  Set Preferences
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

