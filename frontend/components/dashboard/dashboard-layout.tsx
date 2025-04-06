"use client";

import type React from "react";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  TrendingUp,
  LineChart,
  Settings,
  LogOut,
  Menu,
  User,
  Bell,
  Sparkles,
  IndianRupee,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/theme-toggle";
import { useMobile } from "@/hooks/use-mobile";
import Navbar from "@/components/nav";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const isMobile = useMobile();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setIsOpen(false);
    setMounted(true);
  }, [pathname]);

  const navigation = [
    { name: "Invest", href: "/invest", icon: IndianRupee },
    { name: "Dashboard", href: "/dashboard", icon: BarChart3 },
    { name: "Stocks", href: "/stocks", icon: TrendingUp },
    // { name: "Real-time Data", href: "/realtime", icon: LineChart },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const NavLinks = () => (
    <>
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.name}
            href={item.href}
            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-accent ${
              isActive
                ? "bg-primary/10 text-primary dark:bg-primary/20"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <item.icon
              className={`h-5 w-5 ${isActive ? "text-primary" : ""}`}
            />
            {item.name}
          </Link>
        );
      })}
    </>
  );

  if (!mounted) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
      <Navbar />
      <div className="flex flex-1">
        <aside className="hidden w-64 flex-col border-r md:flex">
          <nav className="grid gap-2 p-4">
            <NavLinks />
          </nav>
        </aside>
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
