'use client';

import { motion } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { useState } from 'react';

interface FilterOption {
  label: string;
  value: string;
  count?: number;
}

interface FilterBarProps {
  onSearch?: (term: string) => void;
  onFilter?: (filters: string[]) => void;
  filterOptions?: FilterOption[];
  placeholder?: string;
}

export function FilterBar({
  onSearch,
  onFilter,
  filterOptions = [],
  placeholder = 'Search...',
}: FilterBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    onSearch?.(term);
  };

  const toggleFilter = (value: string) => {
    const updated = activeFilters.includes(value)
      ? activeFilters.filter((f) => f !== value)
      : [...activeFilters, value];
    setActiveFilters(updated);
    onFilter?.(updated);
  };

  const clearFilters = () => {
    setActiveFilters([]);
    setSearchTerm('');
    onFilter?.([]);
    onSearch?.('');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-6 space-y-3"
    >
      {/* Search Bar */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder={placeholder}
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary transition-colors"
        />
      </div>

      {/* Filter Toggle & Active Filters */}
      {filterOptions.length > 0 && (
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 px-3 py-1.5 bg-card border border-border rounded-lg text-sm text-foreground hover:border-primary transition-colors"
          >
            <Filter size={16} />
            Filters
          </motion.button>

          {activeFilters.length > 0 && (
            <>
              {activeFilters.map((filter) => (
                <motion.button
                  key={filter}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => toggleFilter(filter)}
                  className="flex items-center gap-2 px-3 py-1.5 bg-primary/20 border border-primary/30 rounded-lg text-sm text-foreground hover:bg-primary/30 transition-colors"
                >
                  {filter}
                  <X size={14} />
                </motion.button>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                Clear all
              </button>
            </>
          )}
        </div>
      )}

      {/* Filter Dropdown */}
      {showFilters && filterOptions.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-lg p-3 space-y-2"
        >
          {filterOptions.map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded transition-colors"
            >
              <input
                type="checkbox"
                checked={activeFilters.includes(option.value)}
                onChange={() => toggleFilter(option.value)}
                className="w-4 h-4 rounded border-border bg-muted"
              />
              <span className="text-sm text-foreground">{option.label}</span>
              {option.count !== undefined && (
                <span className="text-xs text-muted-foreground">({option.count})</span>
              )}
            </label>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
