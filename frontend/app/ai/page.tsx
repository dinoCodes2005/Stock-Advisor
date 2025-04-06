"use client";

import { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { TrendingUp, Send, Sparkles } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DashboardLayout } from "@/components/dashboard/dashboard-layout";
import { client } from "@/lib/gemini";

export default function StockChat() {
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e?: React.FormEvent<HTMLFormElement>) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const reply = await client.createMessage(userMessage.content);
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error fetching response." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (text: string) => {
    setInput(text);
    setTimeout(() => {
      if (formRef.current) {
        formRef.current.requestSubmit();
      }
    }, 100);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
        <main className="flex-1 container mx-auto py-6 px-4 md:px-6 lg:px-8">
          <Tabs defaultValue="chat" className="w-full min-h-screen">
            <TabsContent value="chat" className="space-y-6 w-full h-full">
              <Card className="border-slate-200 h-full dark:border-slate-800 shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue-500" />
                    Ask Gemini AI
                  </CardTitle>
                  <CardDescription>
                    Ask about stock performance, market trends, investment
                    strategies, or specific companies.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[60vh] pr-4">
                    {messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-12">
                        <div className="bg-blue-50 dark:bg-blue-950/50 p-4 rounded-full">
                          <TrendingUp className="h-12 w-12 text-blue-500" />
                        </div>
                        <div className="space-y-2 max-w-md">
                          <h3 className="text-lg font-medium">
                            Welcome to StockSage
                          </h3>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Your AI-powered stock market assistant. Ask me about
                            any stock, market trends, or investment strategies.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-1/3 mt-4">
                          {[
                            "What's happening with RELIANCE today?",
                            "Explain EPS and P/E ratio",
                            "Should I invest in Indian banking stocks?",
                            "Compare TCS and INFY",
                          ].map((suggestion) => (
                            <Button
                              key={suggestion}
                              variant="outline"
                              className="w-full h-auto py-3 px-4 text-sm text-left justify-start whitespace-normal hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950/50 dark:hover:text-blue-400"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((message, i) => (
                          <div
                            key={i}
                            className={`flex ${
                              message.role === "user"
                                ? "justify-end"
                                : "justify-start"
                            }`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                message.role === "user"
                                  ? "bg-blue-600 text-white"
                                  : "bg-slate-100 dark:bg-slate-800"
                              }`}
                            >
                              {message.content}
                            </div>
                          </div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
                <CardFooter>
                  <form
                    ref={formRef}
                    onSubmit={handleSubmit}
                    className="flex w-full space-x-2"
                  >
                    <Input
                      value={input}
                      onChange={handleInputChange}
                      placeholder="Ask about stocks, markets, or investment strategies..."
                      className="flex-grow border-slate-300 dark:border-slate-700 focus-visible:ring-blue-500"
                    />
                    <Button
                      type="submit"
                      disabled={isLoading || !input.trim()}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          <span>Thinking</span>
                        </div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Send
                        </>
                      )}
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </DashboardLayout>
  );
}
