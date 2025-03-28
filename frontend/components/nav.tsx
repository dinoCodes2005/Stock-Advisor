"use client";
import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  Menu,
  X,
  BarChart3,
  TrendingUp,
  Shield,
  LineChart,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 md:px-6">
      {/* Logo */}
      <div>
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-primary/20">
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <span>StockSage</span>
        </Link>
      </div>

      {/* Desktop Menu */}
      <nav className="hidden md:flex gap-12">
        <Link
          href="/"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Home
        </Link>
        <Link
          href="/invest"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Invest
        </Link>
        <Link
          href="/stocks"
          className="text-sm font-medium hover:text-primary transition-colors"
        >
          Stocks
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <div className="md:hidden flex items-center gap-2">
        <ThemeToggle />
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 rounded-md focus:outline-none"
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-primary" />
          ) : (
            <Menu className="h-6 w-6 text-primary" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 w-full bg-background border-b z-20 md:hidden">
          <nav className="flex flex-col gap-4 p-4">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              href="/invest"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Invest
            </Link>
            <Link
              href="/stocks"
              className="text-sm font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Stocks
            </Link>
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              <Button variant="ghost" size="sm" className="w-full">
                Sign In
              </Button>
            </Link>
          </nav>
        </div>
      )}

      {/* Desktop Right Section */}
      <div className="hidden md:flex items-center gap-2">
        <ThemeToggle />
        <Link href="/login">
          <Button variant="ghost" size="sm">
            Sign In
          </Button>
        </Link>
      </div>
    </header>
  );
}
