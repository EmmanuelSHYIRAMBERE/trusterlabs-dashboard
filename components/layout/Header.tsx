'use client';

import { Bell, User, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';

export function Header() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-card/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8 ml-0 lg:ml-72">
        {/* Left section - Title */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-foreground">Security Operations Center</h2>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-4">
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
              className="flex items-center gap-2 p-2 text-foreground hover:bg-primary/10 rounded-lg transition-colors"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-teal-primary to-purple-secondary rounded-full flex items-center justify-center">
                <User size={16} className="text-white" />
              </div>
              <span className="text-sm font-medium hidden sm:inline">Admin</span>
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
                  <p className="text-sm font-medium text-foreground">Admin User</p>
                  <p className="text-xs text-muted-foreground">admin@trusterlabs.com</p>
                </div>
                <button className="w-full px-4 py-2 text-sm text-foreground hover:bg-primary/10 flex items-center gap-2 transition-colors">
                  <User size={16} />
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-sm text-foreground hover:bg-destructive/10 flex items-center gap-2 transition-colors border-t border-border">
                  <LogOut size={16} />
                  Logout
                </button>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
