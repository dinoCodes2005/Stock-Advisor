"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/dashboard/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Loader2, Save } from "lucide-react"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = () => {
    setIsLoading(true)

    // Simulate API call to save settings
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings and preferences.</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:w-[400px]">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>Update your account details and personal information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">First Name</Label>
                      <Input id="first-name" defaultValue="John" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="last-name">Last Name</Label>
                      <Input id="last-name" defaultValue="Doe" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue="john.doe@example.com" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="password">Change Password</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input id="password" type="password" placeholder="New password" />
                    <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Investment Preferences</CardTitle>
                <CardDescription>Customize your investment preferences and AI recommendations.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="risk-tolerance">Risk Tolerance</Label>
                      <p className="text-sm text-muted-foreground">
                        Adjust your risk tolerance level for AI recommendations.
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Conservative</span>
                      <div className="w-[200px]">
                        <Input id="risk-tolerance" type="range" min="1" max="10" defaultValue="5" />
                      </div>
                      <span className="text-sm text-muted-foreground">Aggressive</span>
                    </div>
                  </div>

                  <Separator />

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
                        "Communication",
                      ].map((sector) => (
                        <div key={sector} className="flex items-center space-x-2">
                          <Switch
                            id={`sector-${sector.toLowerCase()}`}
                            defaultChecked={["Technology", "Healthcare", "Finance"].includes(sector)}
                          />
                          <Label htmlFor={`sector-${sector.toLowerCase()}`} className="text-sm font-normal">
                            {sector}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>ESG Preferences</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="esg-environmental" defaultChecked />
                        <Label htmlFor="esg-environmental" className="text-sm font-normal">
                          Environmental Impact
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="esg-social" defaultChecked />
                        <Label htmlFor="esg-social" className="text-sm font-normal">
                          Social Responsibility
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="esg-governance" defaultChecked />
                        <Label htmlFor="esg-governance" className="text-sm font-normal">
                          Corporate Governance
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Preferences
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>Configure how and when you receive notifications.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">Receive notifications via email.</p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Notification Types</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="price-alerts" className="text-sm font-normal">
                          Price Alerts
                        </Label>
                        <Switch id="price-alerts" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="stock-news" className="text-sm font-normal">
                          Stock News
                        </Label>
                        <Switch id="stock-news" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="ai-recommendations" className="text-sm font-normal">
                          AI Recommendations
                        </Label>
                        <Switch id="ai-recommendations" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="market-updates" className="text-sm font-normal">
                          Market Updates
                        </Label>
                        <Switch id="market-updates" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label htmlFor="account-activity" className="text-sm font-normal">
                          Account Activity
                        </Label>
                        <Switch id="account-activity" defaultChecked />
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Notification Frequency</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="frequency-realtime" defaultChecked />
                        <Label htmlFor="frequency-realtime" className="text-sm font-normal">
                          Real-time
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="frequency-daily" />
                        <Label htmlFor="frequency-daily" className="text-sm font-normal">
                          Daily Digest
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="frequency-weekly" />
                        <Label htmlFor="frequency-weekly" className="text-sm font-normal">
                          Weekly Summary
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={handleSave} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Notification Settings
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}

