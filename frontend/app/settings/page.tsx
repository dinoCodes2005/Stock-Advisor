"use client";

import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, Save } from "lucide-react";
import { checkAuthentication, isAuthenticated } from "@/lib/auth";
import { jwtDecode } from "jwt-decode";
import { getUser } from "@/components/api/fetch-user";
import { string } from "zod";

interface User {
  id: string;
  username: string;
  email: string;
}

export default function SettingsPage() {
  checkAuthentication();
  const token = localStorage.getItem("token");
  const decode: string | null = token ? jwtDecode(token) : null;

  const [user, setUser] = useState<User | null>(null);
  if (decode) {
    useEffect(() => {
      (async function fetchUserData() {
        const userData = await getUser(decode.user_id);
        setUser({
          id: userData.id,
          username: userData.username,
          email: userData.email,
        });
      })();
    }, []);
  }
  console.log(user);

  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);

    // Simulate API call to save settings
    setTimeout(() => {
      setIsLoading(false);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage your account settings.</p>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
                <CardDescription>
                  Update your account details and personal information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name">Username</Label>
                      <Input id="first-name" defaultValue={user?.username} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" defaultValue={user?.email} />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="password">Change Password</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                      id="password"
                      type="password"
                      placeholder="New password"
                    />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="Confirm new password"
                    />
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

          <TabsContent value="notifications" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Email Notifications</Label>
                      <p className="text-sm text-muted-foreground">
                        Receive notifications via email.
                      </p>
                    </div>
                    <Switch id="email-notifications" defaultChecked />
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <Label>Notification Types</Label>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="price-alerts"
                          className="text-sm font-normal"
                        >
                          Price Alerts
                        </Label>
                        <Switch id="price-alerts" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="stock-news"
                          className="text-sm font-normal"
                        >
                          Stock News
                        </Label>
                        <Switch id="stock-news" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="ai-recommendations"
                          className="text-sm font-normal"
                        >
                          AI Recommendations
                        </Label>
                        <Switch id="ai-recommendations" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="market-updates"
                          className="text-sm font-normal"
                        >
                          Market Updates
                        </Label>
                        <Switch id="market-updates" defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <Label
                          htmlFor="account-activity"
                          className="text-sm font-normal"
                        >
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
                        <Label
                          htmlFor="frequency-realtime"
                          className="text-sm font-normal"
                        >
                          Real-time
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="frequency-daily" />
                        <Label
                          htmlFor="frequency-daily"
                          className="text-sm font-normal"
                        >
                          Daily Digest
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="frequency-weekly" />
                        <Label
                          htmlFor="frequency-weekly"
                          className="text-sm font-normal"
                        >
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
  );
}
