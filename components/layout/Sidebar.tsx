"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Shield,
  BarChart3,
  BookOpen,
  Briefcase,
  Settings,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Shield, label: "Security Status", href: "/security-status" },
  { icon: BarChart3, label: "Analytics", href: "/analytics" },
  { icon: BookOpen, label: "Training Programs", href: "/training" },
  { icon: Briefcase, label: "Internships", href: "/internships" },
  { icon: FileText, label: "Blog Management", href: "/blog" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);

  return (
    <>
      {/* Mobile Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-sidebar text-sidebar-foreground p-2 rounded-lg border border-sidebar-border"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-72 bg-sidebar border-r border-sidebar-border overflow-y-auto z-40 transition-transform duration-300",
          "pt-20 lg:pt-0",
          !isOpen && "-translate-x-full lg:translate-x-0",
        )}
      >
        {/* Logo */}
        <div className="px-6 py-8 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-blue-700">
            Truster
            <span className=" text-[#E1A609] ">Labs</span>
          </h1>
          <p className="text-sm text-sidebar-foreground/60 mt-1">
            Cybersecurity Dashboard
          </p>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6">
          <div className="space-y-2">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname?.startsWith(item.href + "/");
              const Icon = item.icon;

              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/10",
                    )}
                  >
                    <Icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-sidebar-border bg-sidebar/50">
          <p className="text-xs text-sidebar-foreground/50">
            © 2025 TrusterLabs. All rights reserved.
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
