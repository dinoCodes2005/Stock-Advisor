"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  ArrowRight,
  BadgeCheck,
  Calculator,
  Clock,
  IndianRupee,
  LineChart,
  Sparkles,
  Target,
} from "lucide-react";
import Link from "next/link";
import { Terminal } from "lucide-react";
import { useRouter } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { checkAuthentication } from "@/lib/auth";

export default function PreferencesPage() {
  const [investmentAmount, setInvestmentAmount] = useState(5000);
  const [investmentDuration, setInvestmentDuration] = useState(5);
  const [riskTolerance, setRiskTolerance] = useState(50);
  const [investmentGoal, setInvestmentGoal] = useState("growth");
  const [investmentFrequency, setInvestmentFrequency] = useState("monthly");
  const [enableAutoInvest, setEnableAutoInvest] = useState(false);
  const [enableDiversification, setEnableDiversification] = useState(true);
  const [enableTaxOptimization, setEnableTaxOptimization] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(false);

  checkAuthentication();

  const handleGeneratePlan = () => {
    // In a real app, this would call an API to generate a plan
    setGeneratedPlan(true);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);
  };

  const handleInputChange = (e) => {
    let value = e.target.value;

    // Remove leading zero unless the value is '0'
    if (value.length > 1 && value.startsWith("0")) {
      value = value.replace(/^0+/, "");
    }

    // Ensure it's within valid range
    let numValue = parseInt(value, 10) || 0;
    if (numValue > 100) numValue = 100;

    setInvestmentDuration(numValue);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Investment Preferences
          </h1>
          <p className="text-muted-foreground">
            Set your investment preferences to get personalized AI-powered
            investment plans.
          </p>
        </div>

        <Tabs defaultValue="preferences" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="preferences">Set Preferences</TabsTrigger>
            <TabsTrigger value="plans">Investment Plans</TabsTrigger>
          </TabsList>

          <TabsContent value="preferences" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-5 w-5 text-primary" />
                      <CardTitle>Investment Amount</CardTitle>
                    </div>
                    <CardDescription>
                      How much are you planning to invest initially?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Amount</span>
                        <span className="text-sm font-bold">
                          {formatCurrency(investmentAmount)}
                        </span>
                      </div>
                      <Slider
                        value={[investmentAmount]}
                        min={10}
                        max={10000000}
                        step={1000}
                        onValueChange={(value) => setInvestmentAmount(value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>₹10</span>
                        <span>₹1,00,00,00,000</span>
                      </div>
                      <div className="pt-2">
                        <Label htmlFor="custom-amount">Custom amount</Label>
                        <div className="relative mt-1">
                          <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="custom-amount"
                            type="number"
                            className="pl-9"
                            value={
                              investmentAmount === 0 ? "" : investmentAmount
                            }
                            onChange={(e) => {
                              const value = e.target.value;
                              if (value === "" || Number(value) < 0) {
                                setInvestmentAmount(0);
                              } else {
                                const numValue = Number(value);
                                if (!isNaN(numValue) && numValue >= 0) {
                                  setInvestmentAmount(numValue);
                                }
                              }
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-primary" />
                      <CardTitle>Investment Duration</CardTitle>
                    </div>
                    <CardDescription>
                      How long do you plan to keep your investments?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Duration</span>

                        <span className="text-gray-400">
                          {investmentDuration} years
                        </span>
                      </div>
                      <Slider
                        value={[investmentDuration]}
                        min={1}
                        max={100}
                        step={1}
                        onValueChange={(value) =>
                          setInvestmentDuration(value[0])
                        }
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>1 year</span>
                        <span>100 years</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        {[1, 5, 10, 15, 20, 25, 30].map((year) => (
                          <Button
                            key={year}
                            variant={
                              investmentDuration === year
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setInvestmentDuration(year)}
                            className="w-full"
                          >
                            {year} {year === 1 ? "year" : "years"}
                          </Button>
                        ))}
                      </div>
                      <div className="pt-2 space-y-4">
                        <Label htmlFor="custom-duration" className="mt-2">
                          Custom Duration
                        </Label>
                        <Input
                          id="custom-duration"
                          type="number"
                          value={
                            investmentDuration === 0 ? "" : investmentDuration
                          }
                          onChange={(e) => {
                            const value = e.target.value;
                            if (value === "" || Number(value) < 0) {
                              setInvestmentDuration(0);
                            } else {
                              const numValue = Number(value);
                              if (!isNaN(numValue) && numValue >= 0) {
                                setInvestmentDuration(numValue);
                              }
                            }
                          }}
                          min={1}
                          max={100}
                          className="w-1/4 bg-gray-950 text-white text-center rounded-lg"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      <CardTitle>Investment Goal</CardTitle>
                    </div>
                    <CardDescription>
                      What is your primary investment objective?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <RadioGroup
                      value={investmentGoal}
                      onValueChange={setInvestmentGoal}
                      className="space-y-3"
                    >
                      {[
                        {
                          value: "growth",
                          label: "Growth",
                          description:
                            "Focus on long-term capital appreciation",
                        },
                        {
                          value: "income",
                          label: "Income",
                          description: "Focus on generating regular income",
                        },
                        {
                          value: "balanced",
                          label: "Balanced",
                          description: "Balance between growth and income",
                        },
                        {
                          value: "preservation",
                          label: "Preservation",
                          description:
                            "Focus on preserving capital with minimal risk",
                        },
                      ].map((goal) => (
                        <div
                          key={goal.value}
                          className="flex items-start space-x-2"
                        >
                          <RadioGroupItem
                            value={goal.value}
                            id={goal.value}
                            className="mt-1"
                          />
                          <Label
                            htmlFor={goal.value}
                            className="flex flex-col cursor-pointer"
                          >
                            <span className="font-medium">{goal.label}</span>
                            <span className="text-xs text-muted-foreground">
                              {goal.description}
                            </span>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-primary" />
                      <CardTitle>Risk Tolerance</CardTitle>
                    </div>
                    <CardDescription>
                      How much risk are you comfortable taking with your
                      investments?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium">Risk Level</span>
                        <span className="text-sm font-bold">
                          {riskTolerance < 30
                            ? "Conservative"
                            : riskTolerance < 70
                            ? "Moderate"
                            : "Aggressive"}
                        </span>
                      </div>
                      <Slider
                        value={[riskTolerance]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => setRiskTolerance(value[0])}
                        className="py-4"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Conservative</span>
                        <span>Moderate</span>
                        <span>Aggressive</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        {[
                          { label: "Low Risk", value: 20 },
                          { label: "Balanced", value: 50 },
                          { label: "High Risk", value: 80 },
                        ].map((option) => (
                          <Button
                            key={option.label}
                            variant={
                              Math.abs(riskTolerance - option.value) < 15
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setRiskTolerance(option.value)}
                            className="w-full"
                          >
                            {option.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Calculator className="h-5 w-5 text-primary" />
                      <CardTitle>Investment Frequency</CardTitle>
                    </div>
                    <CardDescription>
                      How often would you like to contribute to your
                      investments?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Select
                      value={investmentFrequency}
                      onValueChange={setInvestmentFrequency}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select frequency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-time">
                          One-time investment
                        </SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annually">Annually</SelectItem>
                      </SelectContent>
                    </Select>

                    {investmentFrequency !== "one-time" && (
                      <div className="mt-4">
                        <Label htmlFor="recurring-amount">
                          Recurring amount
                        </Label>
                        <div className="relative mt-1">
                          <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="recurring-amount"
                            type="number"
                            className="pl-9"
                            placeholder="500"
                          />
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <BadgeCheck className="h-5 w-5 text-primary" />
                      <CardTitle>Additional Options</CardTitle>
                    </div>
                    <CardDescription>
                      Customize your investment strategy with these options.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="auto-invest">Auto-invest</Label>
                          <p className="text-xs text-muted-foreground">
                            Automatically invest based on your preferences
                          </p>
                        </div>
                        <Switch
                          id="auto-invest"
                          checked={enableAutoInvest}
                          onCheckedChange={setEnableAutoInvest}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="diversification">
                            Portfolio diversification
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Spread investments across different asset classes
                          </p>
                        </div>
                        <Switch
                          id="diversification"
                          checked={enableDiversification}
                          onCheckedChange={setEnableDiversification}
                        />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="tax-optimization">
                            Tax optimization
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Optimize investments for tax efficiency
                          </p>
                        </div>
                        <Switch
                          id="tax-optimization"
                          checked={enableTaxOptimization}
                          onCheckedChange={setEnableTaxOptimization}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <Button size="lg" onClick={handleGeneratePlan}>
                Generate Investment Plan
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="plans" className="mt-6">
            {generatedPlan ? (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-primary" />
                      <CardTitle>Your AI-Generated Investment Plan</CardTitle>
                    </div>
                    <CardDescription>
                      Based on your preferences, our AI has generated the
                      following investment plan.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="rounded-lg border bg-card p-4">
                        <h3 className="text-lg font-medium mb-2">
                          Plan Summary
                        </h3>
                        <div className="grid gap-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Initial Investment:
                            </span>
                            <span className="font-medium">
                              {formatCurrency(investmentAmount)}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Investment Duration:
                            </span>
                            <span className="font-medium">
                              {investmentDuration} years
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Risk Profile:
                            </span>
                            <span className="font-medium">
                              {riskTolerance < 30
                                ? "Conservative"
                                : riskTolerance < 70
                                ? "Moderate"
                                : "Aggressive"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Investment Goal:
                            </span>
                            <span className="font-medium capitalize">
                              {investmentGoal}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">
                              Contribution Frequency:
                            </span>
                            <span className="font-medium capitalize">
                              {investmentFrequency}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3">
                          Recommended Asset Allocation
                        </h3>
                        <div className="grid gap-3">
                          {[
                            {
                              name: "US Stocks",
                              percentage: (riskTolerance * 0.4) / 100,
                            },
                            {
                              name: "International Stocks",
                              percentage: (riskTolerance * 0.2) / 100,
                            },
                            {
                              name: "Bonds",
                              percentage: ((100 - riskTolerance) * 0.6) / 100,
                            },
                            {
                              name: "Real Estate",
                              percentage: (riskTolerance * 0.2) / 100,
                            },
                            {
                              name: "Cash",
                              percentage: ((100 - riskTolerance) * 0.2) / 100,
                            },
                          ].map((asset) => (
                            <div key={asset.name} className="space-y-1">
                              <div className="flex justify-between text-sm">
                                <span>{asset.name}</span>
                                <span className="font-medium">
                                  {Math.round(asset.percentage * 100)}%
                                </span>
                              </div>
                              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full bg-primary"
                                  style={{
                                    width: `${asset.percentage * 100}%`,
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3">
                          Recommended Investment Vehicles
                        </h3>
                        <div className="space-y-3">
                          {[
                            {
                              name: "Vanguard Total Stock Market ETF (VTI)",
                              type: "US Stocks",
                              allocation: Math.round(riskTolerance * 0.4),
                            },
                            {
                              name: "Vanguard Total International Stock ETF (VXUS)",
                              type: "International Stocks",
                              allocation: Math.round(riskTolerance * 0.2),
                            },
                            {
                              name: "Vanguard Total Bond Market ETF (BND)",
                              type: "Bonds",
                              allocation: Math.round(
                                (100 - riskTolerance) * 0.6
                              ),
                            },
                            {
                              name: "Vanguard Real Estate ETF (VNQ)",
                              type: "Real Estate",
                              allocation: Math.round(riskTolerance * 0.2),
                            },
                            {
                              name: "Cash/Money Market",
                              type: "Cash",
                              allocation: Math.round(
                                (100 - riskTolerance) * 0.2
                              ),
                            },
                          ].map((vehicle) => (
                            <div
                              key={vehicle.name}
                              className="flex justify-between items-center p-3 rounded-lg border"
                            >
                              <div>
                                <div className="font-medium">
                                  {vehicle.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {vehicle.type}
                                </div>
                              </div>
                              <div className="text-sm font-medium">
                                {vehicle.allocation}%
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-medium mb-3">
                          Projected Growth
                        </h3>
                        <div className="rounded-lg border p-4">
                          <div className="space-y-3">
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Initial Investment:
                              </span>
                              <span className="text-sm font-medium">
                                {formatCurrency(investmentAmount)}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Projected Value (5 years):
                              </span>
                              <span className="text-sm font-medium">
                                {formatCurrency(
                                  investmentAmount *
                                    Math.pow(
                                      1 + (0.05 + riskTolerance * 0.0008),
                                      5
                                    )
                                )}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-sm text-muted-foreground">
                                Projected Value (10 years):
                              </span>
                              <span className="text-sm font-medium">
                                {formatCurrency(
                                  investmentAmount *
                                    Math.pow(
                                      1 + (0.05 + riskTolerance * 0.0008),
                                      10
                                    )
                                )}
                              </span>
                            </div>
                            {investmentDuration > 10 && (
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">
                                  Projected Value ({investmentDuration} years):
                                </span>
                                <span className="text-sm font-medium">
                                  {formatCurrency(
                                    investmentAmount *
                                      Math.pow(
                                        1 + (0.05 + riskTolerance * 0.0008),
                                        investmentDuration
                                      )
                                  )}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 text-xs text-muted-foreground">
                            * Projections are estimates based on historical data
                            and are not guaranteed.
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() =>
                        document
                          .querySelector('[data-value="preferences"]')
                          ?.click()
                      }
                    >
                      Adjust Preferences
                    </Button>
                    <Link href="/dashboard">
                      <Button>
                        Save Plan
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Sparkles className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">
                  No Investment Plan Yet
                </h3>
                <p className="text-muted-foreground max-w-md mb-6">
                  Set your investment preferences and generate a plan to see
                  AI-powered recommendations.
                </p>
                <Button
                  onClick={() =>
                    document
                      .querySelector('[data-value="preferences"]')
                      ?.click()
                  }
                >
                  Set Preferences
                </Button>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
