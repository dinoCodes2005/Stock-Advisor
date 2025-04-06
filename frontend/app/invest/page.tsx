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
import { useRouter } from "next/navigation";
import { checkAuthentication } from "@/lib/auth";
import { createInvestment } from "@/components/api/create-investment";
import { jwtDecode } from "jwt-decode";
import { getUser } from "@/components/api/fetch-user";

export interface Investment {
  user?: number;
  monthly_investment: number;
  investment_duration: number;
  target_amount: number;
  rts_score: number;
}

export default function PreferencesPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(0);
  const [id, setId] = useState(0);
  const [investmentAmount, setInvestmentAmount] = useState(5000);
  const [rtsScore, setRtsScore] = useState(0.5);
  const [investmentDuration, setInvestmentDuration] = useState(5);
  const [riskTolerance, setRiskTolerance] = useState("low");
  const [investmentGoal, setInvestmentGoal] = useState(10000);
  const [investmentFrequency, setInvestmentFrequency] = useState("monthly");
  const [volatile, setVolatile] = useState(0.5);
  const [generatedPlan, setGeneratedPlan] = useState(true);

  const token = localStorage.getItem("token");
  const decode: string | null = token ? jwtDecode(token) : null;

  checkAuthentication();

  useEffect(() => {
    if (decode) {
      console.log("Ye mera id hai", decode.user_id);
      getUser(decode.user_id).then((userData) => {
        setUserId(userData);
        setId(decode.user_id);
      });
    }
  }, []);

  const handleGeneratePlan = async () => {
    const investmentData: Investment = {
      user: id,
      monthly_investment: investmentAmount,
      investment_duration: investmentDuration,
      target_amount: investmentGoal, // assuming "target_amount" = "investmentGoal"
      rts_score: rtsScore,
    };
    console.log(investmentData);
    const response: Investment = await createInvestment(investmentData);
    if (response) {
      setGeneratedPlan(true);
      router.push(`/recommendations/${response.investment_id}`);
    } else {
      console.error("Error");
    }
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
    let numValue = Number.parseInt(value, 10) || 0;
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
          <TabsContent value="preferences" className="mt-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <IndianRupee className="h-5 w-5 text-primary" />
                      <CardTitle>Monthly Investment Amount</CardTitle>
                    </div>
                    <CardDescription>
                      How much are you planning to invest monthly?
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
                        <span>₹10,00,000</span>
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
                        {[1, 5, 10, 15, 20, 30].map((year) => (
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
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Target className="h-5 w-5 text-primary" />
                      <CardTitle>Investment Goal</CardTitle>
                    </div>
                    <CardDescription>
                      What is your target amount?
                    </CardDescription>
                    <div className="relative mt-1">
                      <IndianRupee className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="custom-amount"
                        type="number"
                        className="pl-9"
                        value={investmentGoal === 0 ? "" : investmentGoal}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || Number(value) < 0) {
                            setInvestmentGoal(0);
                          } else {
                            const numValue = Number(value);
                            if (!isNaN(numValue) && numValue >= 0) {
                              setInvestmentGoal(numValue);
                            }
                          }
                        }}
                      />
                    </div>
                  </CardHeader>
                  <CardContent></CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-2">
                      <LineChart className="h-5 w-5 text-primary" />
                      <CardTitle>RTS Score</CardTitle>
                    </div>
                    <CardDescription>
                      Relative Total Shareholder Return <br />
                      How you want your investment to perform compared to the
                      market?
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {/* Score Display */}
                      <div className="flex justify-between">
                        <span className="text-sm font-bold">{rtsScore}</span>
                      </div>

                      {/* Slider */}
                      <Slider
                        value={[rtsScore]}
                        min={0}
                        max={100}
                        step={1}
                        onValueChange={(value) => setRtsScore(value[0])}
                        className="py-4"
                      />

                      {/* Slider Labels */}
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Underperforming</span>
                        <span>In Line</span>
                        <span>Outperforming</span>
                      </div>

                      {/* Input Field */}
                      <Input
                        id="custom-rts"
                        type="number"
                        className="pl-9"
                        value={rtsScore === 0 ? "" : rtsScore}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (value === "" || Number(value) < 0) {
                            setRtsScore(0);
                          } else {
                            const numValue = Number(value);
                            if (!isNaN(numValue) && numValue >= 0) {
                              setRtsScore(numValue);
                            }
                          }
                        }}
                      />

                      {/* Preset Buttons */}
                      <div className="grid grid-cols-3 gap-2 pt-2">
                        {[
                          { label: "Low", value: 0 },
                          { label: "Market Avg", value: 50 },
                          { label: "High", value: 100 },
                        ].map((option) => (
                          <Button
                            key={option.label}
                            variant={
                              Math.abs(rtsScore - option.value) < 5
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => setRtsScore(option.value)}
                            className="w-full"
                          >
                            {option.label}
                          </Button>
                        ))}
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
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
