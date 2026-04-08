"use client";

import { Bell, User, LogOut, Sun, Moon, Monitor } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

export function Header() {
  const { data: session, status } = useSession();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  if (status !== "loading" && status !== "authenticated") {
    router.push("/");
  }

  const themeOptions: {
    value: string;
    icon: React.ReactNode;
    label: string;
  }[] = [
    { value: "light", icon: <Sun size={16} />, label: "Light" },
    { value: "dark", icon: <Moon size={16} />, label: "Dark" },
    { value: "system", icon: <Monitor size={16} />, label: "Auto" },
  ];

  const currentThemeIcon =
    theme === "light" ? (
      <Sun size={18} />
    ) : theme === "system" ? (
      <Monitor size={18} />
    ) : (
      <Moon size={18} />
    );

  const [isThemeMenuOpen, setIsThemeMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left section - Title */}
        <div className="hidden md:flex flex-1 ">
          <h2 className="text-xl font-semibold text-foreground">
            Fortify . Empower . Defend
          </h2>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsThemeMenuOpen(!isThemeMenuOpen)}
              className="relative p-2 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
              title="Toggle theme"
            >
              {currentThemeIcon}
            </motion.button>
            {isThemeMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-36 bg-card rounded-lg border border-border shadow-lg overflow-hidden z-50"
              >
                {themeOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setTheme(opt.value);
                      setIsThemeMenuOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-sm flex items-center gap-2 transition-colors ${
                      theme === opt.value
                        ? "bg-primary/20 text-primary"
                        : "text-foreground hover:bg-primary/10"
                    }`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </motion.div>
            )}
          </div>

          {/* Notification Bell */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
          >
            <Bell size={20} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-accent rounded-full" />
          </motion.button>

          {/* User Menu */}
          <div className="relative">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-2 text-foreground hover:bg-primary/10 rounded-lg transition-colors border border-border"
            >
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User Avatar"}
                  width={40}
                  height={40}
                  className="w-8 h-8 rounded-full object-cover border border-border"
                />
              ) : (
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white text-2xl font-semibold">
                  {session?.user?.name?.charAt(0)}
                </div>
              )}

              <span className="text-sm font-medium hidden sm:inline">
                {session?.user?.name?.split(" ")[0] || "User"}
              </span>
            </motion.button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-card rounded-lg border border-border shadow-lg overflow-hidden"
              >
                <div className="p-3 border-b border-border">
                  <p className="text-sm font-medium text-foreground">
                    {session?.user?.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {session?.user?.email}
                  </p>
                </div>
                <Link href="/dashboard/settings" className="p-2 font-semibold">
                  <button className="w-full px-4 py-2 text-sm text-foreground hover:bg-primary/10 flex items-center gap-2 transition-colors">
                    <User size={16} />
                    Profile
                  </button>
                </Link>

                <Link href="/api/auth/signout" className="p-2 font-semibold">
                  <button className="w-full px-4 py-2 text-sm text-foreground hover:bg-destructive/10 flex items-center gap-2 transition-colors border-t border-border">
                    <LogOut size={16} />
                    Logout{" "}
                  </button>
                </Link>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
