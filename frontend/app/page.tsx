"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  TrendingUp,
  Shield,
  Sparkles,
  LineChart,
  Zap,
  ChevronRight,
  Rocket,
  PieChart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/nav";
import { motion } from "framer-motion";

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans transition-colors duration-300">
      <Navbar />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 flex justify-center relative overflow-hidden">
          {/* Dynamic Background with Gradient Animation */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-primary/10 animate-gradient-slow -z-10" />

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 bg-grid-small-black/[0.1] dark:bg-grid-small-white/[0.05] animate-pulse-slow -z-10" />

          {/* Animated Blur Circles */}
          <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[100px] animate-blob -z-10" />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-blue-500/10 blur-[100px] animate-blob animation-delay-2000 -z-10" />
          <div className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full bg-green-500/10 blur-[100px] animate-blob animation-delay-4000 -z-10" />

          {/* Backdrop Blur */}
          <div className="absolute inset-0 bg-background/60 backdrop-blur-md -z-10" />

          {/* Main Container */}
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-16 items-center">
              {/* Left Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="flex flex-col justify-center space-y-6"
              >
                {/* Highlighted Tag */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary max-w-max"
                >
                  <Sparkles className="mr-2 h-5 w-5 text-primary animate-pulse" />
                  AI-Powered Investment Platform
                </motion.div>

                {/* Heading and Description */}
                <div className="space-y-4">
                  <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.7 }}
                    className="text-4xl tracking-tight font-bold sm:text-5xl xl:text-6xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-primary/70"
                  >
                    Smart Stock Investments Powered by AI
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.7 }}
                    className="max-w-[600px] text-muted-foreground md:text-lg"
                  >
                    Get personalized stock recommendations based on your
                    preferences, risk tolerance, and investment goals.
                  </motion.p>
                </div>

                {/* CTA Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="flex flex-col gap-3 min-[400px]:flex-row"
                >
                  <Link href="/login?register=true">
                    <Button
                      size="lg"
                      className="gap-1.5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:translate-y-[-2px]"
                    >
                      Get Started
                      <ArrowRight className="h-5 w-5 animate-bounce-x" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-primary/20 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all duration-300 transform hover:translate-y-[-2px]"
                    >
                      Learn More
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>

              {/* Right Content - Stock Data Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex justify-center"
              >
                <div
                  className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden border border-primary/20 bg-background/50 backdrop-blur-lg shadow-[0_0_15px_rgba(0,0,0,0.1)] dark:shadow-[0_0_15px_rgba(255,255,255,0.05)] transform hover:scale-[1.02] transition-all duration-500"
                  style={{
                    transform: `perspective(1000px) rotateY(${
                      scrollY * 0.01
                    }deg) rotateX(${-scrollY * 0.01}deg)`,
                  }}
                >
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center" />

                  {/* Stock Cards */}
                  <div className="grid grid-cols-2 gap-4 p-6 w-full">
                    {/* Market Trend Card */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5, duration: 0.5 }}
                      className="col-span-2 flex items-center justify-between bg-background/80 backdrop-blur-md p-3 rounded-lg border border-primary/20 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 group"
                    >
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-5 w-5 text-primary group-hover:text-green-500 transition-colors duration-300" />
                        <span className="font-medium">Market Trend</span>
                      </div>
                      <div className="text-green-500 font-medium group-hover:scale-110 transition-transform duration-300">
                        +1.2%
                      </div>
                    </motion.div>

                    {/* Individual Stock Cards */}
                    {[
                      {
                        ticker: "AAPL",
                        price: "$187.32",
                        change: "+1.32%",
                        positive: true,
                        delay: 0.6,
                      },
                      {
                        ticker: "MSFT",
                        price: "$378.85",
                        change: "+1.12%",
                        positive: true,
                        delay: 0.7,
                      },
                      {
                        ticker: "TSLA",
                        price: "$245.67",
                        change: "-1.56%",
                        positive: false,
                        delay: 0.8,
                      },
                      {
                        ticker: "NVDA",
                        price: "$487.21",
                        change: "+2.60%",
                        positive: true,
                        delay: 0.9,
                      },
                    ].map((stock, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: stock.delay, duration: 0.5 }}
                        className="bg-background/80 backdrop-blur-md p-3 rounded-lg border border-primary/20 flex flex-col hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 transform hover:translate-y-[-2px] group"
                      >
                        <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors duration-300">
                          {stock.ticker}
                        </span>
                        <span className="font-medium">{stock.price}</span>
                        <span
                          className={`text-xs ${
                            stock.positive ? "text-green-500" : "text-red-500"
                          } group-hover:font-bold transition-all duration-300`}
                        >
                          {stock.change}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Floating Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Active Users",
                  value: "10,000+",
                  icon: <Zap className="h-5 w-5 text-primary" />,
                  delay: 0.7,
                },
                {
                  label: "Stocks Analyzed",
                  value: "5,000+",
                  icon: <BarChart3 className="h-5 w-5 text-primary" />,
                  delay: 0.8,
                },
                {
                  label: "Success Rate",
                  value: "92%",
                  icon: <PieChart className="h-5 w-5 text-primary" />,
                  delay: 0.9,
                },
                {
                  label: "Avg. Return",
                  value: "18.7%",
                  icon: <TrendingUp className="h-5 w-5 text-primary" />,
                  delay: 1.0,
                },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: stat.delay, duration: 0.5 }}
                  className="bg-background/80 backdrop-blur-md border border-primary/20 rounded-xl p-4 flex flex-col items-center text-center hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 transform hover:translate-y-[-5px]"
                >
                  <div className="p-2 rounded-full bg-primary/10 mb-2">
                    {stat.icon}
                  </div>
                  <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">
                    {stat.value}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="features"
          className="w-full py-12 md:py-24 lg:py-32 bg-muted/50 flex justify-center relative overflow-hidden"
        >
          {/* Background Elements */}
          <div className="absolute inset-0 bg-grid-small-black/[0.1] dark:bg-grid-small-white/[0.05] -z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background -z-10" />

          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <div className="inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Sparkles className="mr-2 h-4 w-4 text-primary animate-pulse" />
                Intelligent Features
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-primary/70">
                Powerful AI-Driven Tools
              </h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our AI-powered platform offers a range of features to help you
                make informed investment decisions.
              </p>
            </motion.div>

            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12">
              {[
                {
                  icon: <TrendingUp className="h-10 w-10 text-primary" />,
                  title: "AI Recommendations",
                  description:
                    "Get personalized stock recommendations based on your preferences and market analysis.",
                  delay: 0.2,
                },
                {
                  icon: <LineChart className="h-10 w-10 text-primary" />,
                  title: "Real-time Data",
                  description:
                    "Access real-time stock data and market trends to make timely investment decisions.",
                  delay: 0.4,
                },
                {
                  icon: <Shield className="h-10 w-10 text-primary" />,
                  title: "Risk Analysis",
                  description:
                    "Understand the risk associated with each investment opportunity before making decisions.",
                  delay: 0.6,
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: feature.delay, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="group flex flex-col items-center space-y-4 rounded-xl border border-primary/20 bg-background p-6 transition-all hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 transform hover:translate-y-[-5px]"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-colors duration-300">
                    <motion.div
                      animate={{ rotate: [0, 5, 0, -5, 0] }}
                      transition={{
                        repeat: Number.POSITIVE_INFINITY,
                        duration: 5,
                        ease: "easeInOut",
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground text-center">
                    {feature.description}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:text-primary group-hover:bg-primary/10 transition-colors duration-300"
                  >
                    Learn more{" "}
                    <ChevronRight className="ml-1 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden flex justify-center">
          {/* Background Elements */}
          <div className="absolute inset-0 bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2] -z-10" />
          <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-background/60 backdrop-blur-sm -z-10" />

          {/* Animated Blur Circles */}
          <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/5 blur-[100px] animate-blob animation-delay-3000 -z-10" />
          <div className="absolute bottom-1/3 left-1/4 w-[300px] h-[300px] rounded-full bg-blue-500/5 blur-[100px] animate-blob animation-delay-5000 -z-10" />

          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="order-2 lg:order-1"
              >
                <div className="relative rounded-xl overflow-hidden border border-primary/20 shadow-xl transform hover:scale-[1.02] transition-all duration-500">
                  <div className="aspect-video bg-muted/50 p-6 flex items-center justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                      >
                        <h4 className="text-lg font-medium mb-2 flex items-center">
                          <Zap className="h-5 w-5 text-primary mr-2 animate-pulse" />
                          AI Score
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>MSFT</span>
                            <div className="text-xs font-medium bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary rounded-full px-2 py-1">
                              92/100
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>AAPL</span>
                            <div className="text-xs font-medium bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary rounded-full px-2 py-1">
                              89/100
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>GOOGL</span>
                            <div className="text-xs font-medium bg-gradient-to-r from-primary/20 to-blue-500/20 text-primary rounded-full px-2 py-1">
                              87/100
                            </div>
                          </div>
                        </div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                        viewport={{ once: true }}
                        className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-primary/20 hover:border-primary/40 hover:shadow-lg transition-all duration-300"
                      >
                        <h4 className="text-lg font-medium mb-2 flex items-center">
                          <BarChart3 className="h-5 w-5 text-primary mr-2 animate-pulse" />
                          Market Insights
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>Tech sector up 1.2% today</p>
                          <p>Energy stocks showing volatility</p>
                          <p>Healthcare sector stable growth</p>
                          <p>Financial services trending up</p>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.7 }}
                viewport={{ once: true }}
                className="order-1 lg:order-2"
              >
                <div className="space-y-4">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm"
                  >
                    <Sparkles className="mr-1 h-4 w-4 text-primary animate-pulse" />
                    <span>Advanced Analytics</span>
                  </motion.div>
                  <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-primary/70"
                  >
                    Make Data-Driven Investment Decisions
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="text-muted-foreground md:text-xl"
                  >
                    Our platform analyzes market trends, company performance,
                    and economic indicators to provide you with actionable
                    insights.
                  </motion.p>
                  <motion.ul
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="space-y-2"
                  >
                    {[
                      "Personalized AI recommendations based on your risk profile",
                      "Real-time market data and analysis",
                      "Predictive analytics for potential market movements",
                      "Comprehensive stock screening and filtering",
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.3 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-2"
                      >
                        <div className="h-2 w-2 rounded-full bg-gradient-to-r from-primary to-blue-500" />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </motion.ul>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    viewport={{ once: true }}
                    className="pt-4"
                  >
                    <Link href="/login?register=true">
                      <Button className="gap-1.5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:translate-y-[-2px]">
                        Start Investing Smarter
                        <ArrowRight className="h-4 w-4 animate-bounce-x" />
                      </Button>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="w-full py-12 md:py-16 bg-gradient-to-br from-primary/10 via-background to-blue-500/10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="container px-4 md:px-6 text-center"
          >
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="inline-flex items-center justify-center rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
                <Rocket className="mr-2 h-5 w-5 text-primary animate-pulse" />
                Ready to Start?
              </div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-blue-500 to-primary/70">
                Begin Your Investment Journey Today
              </h2>
              <p className="text-muted-foreground md:text-xl max-w-2xl mx-auto">
                Join thousands of investors who are already using our AI-powered
                platform to make smarter investment decisions.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                <Link href="/login?register=true">
                  <Button
                    size="lg"
                    className="gap-1.5 bg-gradient-to-r from-primary to-blue-600 hover:from-primary/90 hover:to-blue-700 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 transform hover:translate-y-[-2px] w-full sm:w-auto"
                  >
                    Create Free Account
                    <ArrowRight className="h-5 w-5 animate-bounce-x" />
                  </Button>
                </Link>
                <Link href="/demo">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary/20 hover:bg-primary/10 hover:border-primary hover:text-primary transition-all duration-300 transform hover:translate-y-[-2px] w-full sm:w-auto"
                  >
                    Watch Demo
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0 bg-muted/30">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-gradient-to-br from-primary/30 to-blue-500/30">
              <Sparkles className="h-3 w-3 text-primary" />
            </div>
            <p className="text-muted-foreground">
              &copy; {new Date().getFullYear()} StockSage AI. All rights
              reserved.
            </p>
          </div>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              Terms
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Privacy
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
