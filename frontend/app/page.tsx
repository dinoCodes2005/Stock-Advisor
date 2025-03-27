import Link from "next/link"
import { ArrowRight, BarChart3, TrendingUp, Shield, Sparkles, LineChart, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-background transition-colors duration-300">
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
        <div className="flex items-center gap-2 font-bold text-xl">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span>StockSage AI</span>
        </div>
        <nav className="hidden md:flex gap-6">
          <Link href="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#about" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link href="/login">
            <Button variant="outline" size="sm">
              Log In
            </Button>
          </Link>
          <Link href="/login?register=true" className="hidden sm:block">
            <Button size="sm">Sign Up</Button>
          </Link>
        </div>
      </header>
      <main className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2] -z-10" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm -z-10" />
          <div className="container px-4 md:px-6 relative">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="flex flex-col justify-center space-y-4">
                <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
                  <Sparkles className="mr-1 h-4 w-4 text-primary" />
                  <span>AI-Powered Investment Platform</span>
                </div>
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
                    Smart Stock Investments Powered by AI
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl">
                    Get personalized stock recommendations based on your preferences, risk tolerance, and investment
                    goals.
                  </p>
                </div>
                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                  <Link href="/login?register=true">
                    <Button size="lg" className="gap-1.5 bg-primary hover:bg-primary/90">
                      Get Started
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="border-primary/20 hover:bg-primary/10">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="flex justify-center">
                <div className="relative w-full max-w-[500px] aspect-video rounded-xl overflow-hidden shadow-2xl border border-primary/20 bg-background/50 backdrop-blur-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-primary/20 flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-4 p-6 w-full">
                      <div className="col-span-2 flex items-center justify-between bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-primary/20">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-primary" />
                          <span className="font-medium">Market Trend</span>
                        </div>
                        <div className="text-green-500 font-medium">+1.2%</div>
                      </div>
                      <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-primary/20 flex flex-col">
                        <span className="text-xs text-muted-foreground">AAPL</span>
                        <span className="font-medium">$187.32</span>
                        <span className="text-xs text-green-500">+1.32%</span>
                      </div>
                      <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-primary/20 flex flex-col">
                        <span className="text-xs text-muted-foreground">MSFT</span>
                        <span className="font-medium">$378.85</span>
                        <span className="text-xs text-green-500">+1.12%</span>
                      </div>
                      <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-primary/20 flex flex-col">
                        <span className="text-xs text-muted-foreground">TSLA</span>
                        <span className="font-medium">$245.67</span>
                        <span className="text-xs text-red-500">-1.56%</span>
                      </div>
                      <div className="bg-background/80 backdrop-blur-sm p-3 rounded-lg border border-primary/20 flex flex-col">
                        <span className="text-xs text-muted-foreground">NVDA</span>
                        <span className="font-medium">$487.21</span>
                        <span className="text-xs text-green-500">+2.60%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Intelligent Features</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our AI-powered platform offers a range of features to help you make informed investment decisions.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-12 mt-8">
              {[
                {
                  icon: <TrendingUp className="h-10 w-10 text-primary" />,
                  title: "AI Recommendations",
                  description: "Get personalized stock recommendations based on your preferences and market analysis.",
                },
                {
                  icon: <LineChart className="h-10 w-10 text-primary" />,
                  title: "Real-time Data",
                  description: "Access real-time stock data and market trends to make timely investment decisions.",
                },
                {
                  icon: <Shield className="h-10 w-10 text-primary" />,
                  title: "Risk Analysis",
                  description:
                    "Understand the risk associated with each investment opportunity before making decisions.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group flex flex-col items-center space-y-4 rounded-lg border border-primary/20 bg-background p-6 transition-all hover:shadow-lg hover:shadow-primary/5 hover:border-primary/30"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-small-black/[0.2] dark:bg-grid-small-white/[0.2] -z-10" />
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm -z-10" />
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <div className="relative rounded-xl overflow-hidden border border-primary/20 shadow-xl">
                  <div className="aspect-video bg-muted/50 p-6 flex items-center justify-center">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                      <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-primary/20">
                        <h4 className="text-lg font-medium mb-2 flex items-center">
                          <Zap className="h-5 w-5 text-primary mr-2" />
                          AI Score
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span>MSFT</span>
                            <div className="text-xs font-medium bg-primary/10 text-primary rounded-full px-2 py-1">
                              92/100
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>AAPL</span>
                            <div className="text-xs font-medium bg-primary/10 text-primary rounded-full px-2 py-1">
                              89/100
                            </div>
                          </div>
                          <div className="flex justify-between items-center">
                            <span>GOOGL</span>
                            <div className="text-xs font-medium bg-primary/10 text-primary rounded-full px-2 py-1">
                              87/100
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="bg-background/80 backdrop-blur-sm p-4 rounded-lg border border-primary/20">
                        <h4 className="text-lg font-medium mb-2 flex items-center">
                          <BarChart3 className="h-5 w-5 text-primary mr-2" />
                          Market Insights
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>Tech sector up 1.2% today</p>
                          <p>Energy stocks showing volatility</p>
                          <p>Healthcare sector stable growth</p>
                          <p>Financial services trending up</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="order-1 lg:order-2">
                <div className="space-y-4">
                  <div className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm">
                    <Sparkles className="mr-1 h-4 w-4 text-primary" />
                    <span>Advanced Analytics</span>
                  </div>
                  <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                    Make Data-Driven Investment Decisions
                  </h2>
                  <p className="text-muted-foreground md:text-xl">
                    Our platform analyzes market trends, company performance, and economic indicators to provide you
                    with actionable insights.
                  </p>
                  <ul className="space-y-2">
                    {[
                      "Personalized AI recommendations based on your risk profile",
                      "Real-time market data and analysis",
                      "Predictive analytics for potential market movements",
                      "Comprehensive stock screening and filtering",
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-4">
                    <Link href="/login?register=true">
                      <Button className="gap-1.5">
                        Start Investing Smarter
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="border-t py-6 md:py-0 bg-muted/30">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center justify-center h-6 w-6 rounded-full bg-primary/20">
              <Sparkles className="h-3 w-3 text-primary" />
            </div>
            <p className="text-muted-foreground">
              &copy; {new Date().getFullYear()} StockSage AI. All rights reserved.
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
  )
}

