"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2 } from "lucide-react"

interface PreferenceFormProps {
  onSubmit: () => void
}

export function PreferenceForm({ onSubmit }: PreferenceFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [riskTolerance, setRiskTolerance] = useState(50);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call to process preferences
    setTimeout(() => {
      setIsLoading(false);
      onSubmit();
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="investment-goal">Investment Goal</Label>
        <Select defaultValue="growth">
          <SelectTrigger id="investment-goal">
            <SelectValue placeholder="Select your investment goal" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="growth">Growth</SelectItem>
            <SelectItem value="income">Income</SelectItem>
            <SelectItem value="preservation">Capital Preservation</SelectItem>
            <SelectItem value="balanced">Balanced</SelectItem>
            <SelectItem value="aggressive">Aggressive Growth</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="investment-horizon">Investment Horizon</Label>
        <Select defaultValue="medium">
          <SelectTrigger id="investment-horizon">
            <SelectValue placeholder="Select your investment horizon" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="short\">Short Term (< 1 year)</SelectItem>
            <SelectItem value="medium">Medium Term (1-5 years)</SelectItem>
            <SelectItem value="long">Long Term (5+ years)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label>Risk Tolerance</Label>
          <span className="text-sm text-muted-foreground">{riskTolerance}%</span>
        </div>
        <Slider
          defaultValue={[50]}
          max={100}
          step={1}
          onValueChange={(value) => setRiskTolerance(value[0])}
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Conservative</span>
          <span>Moderate</span>
          <span>Aggressive</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <Label>Investment Sectors</Label>
        <div className="grid grid-cols-2 gap-2">
          {[
            "Technology", 
            "Healthcare", 
            "Finance", 
            "Energy", 
            "Consumer Goods", 
            "Real Estate",
            "Utilities",
            "Communication"
          ].map((sector) => (
            <div key={sector} className="flex items-center space-x-2">
              <Checkbox id={`sector-${sector.toLowerCase()}`} />
              <Label htmlFor={`sector-${sector.toLowerCase()}`} className="text-sm font-normal">
                {sector}
              </Label>
            </div>
          ))}
        </div>
      </div>
      
      <div className="space-y-3">
        <Label>ESG Preferences</Label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox id="esg-environmental" />
            <Label htmlFor="esg-environmental" className="text-sm font-normal">
              Environmental Impact
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="esg-social" />
            <Label htmlFor="esg-social" className="text-sm font-normal">
              Social Responsibility
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox id="esg-governance" />
            <Label htmlFor="esg-governance" className="text-sm font-normal">
              Corporate Governance
            </Label>
          </div>
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyzing preferences...
          </>
        ) : (
          "Get Recommendations"
        )}
      </Button>
    </form>
  );
}

