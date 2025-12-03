"use client";

import React from "react";
import { motion } from "framer-motion";

interface SeasonFilterProps {
  selectedSeason: number | "all";
  onSeasonChange: (season: number | "all") => void;
  sharkCounts: Record<number | "all", number>;
  seasonOptions: Array<{
    value: number | "all";
    label: string;
  }>;
}

export function SeasonFilter({
  selectedSeason,
  onSeasonChange,
  sharkCounts,
  seasonOptions,
}: SeasonFilterProps) {

  return (
    <div className="flex flex-col items-center gap-6">
      <motion.h2
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="text-3xl md:text-4xl font-bold text-white text-center"
      >
        Meet Our Sharks
      </motion.h2>

      <div className="flex flex-wrap gap-3 justify-center">
        {seasonOptions.map((season, index) => {
          const isActive = selectedSeason === season.value;
          const count = sharkCounts[season.value];

          return (
            <motion.button
              key={season.value}
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                delay: index * 0.1,
              }}
              onClick={() => onSeasonChange(season.value)}
              whileHover={{
                scale: 1.05,
              }}
              whileTap={{
                scale: 0.95,
              }}
              className={`
                relative px-6 py-3 rounded-full font-semibold transition-all duration-300
                ${isActive ? "bg-gradient-to-r from-yellow-400 to-orange-500 text-black shadow-lg shadow-yellow-500/50" : "bg-white/10 text-slate-300 hover:bg-white/20 border border-white/20"}
              `}
            >
              <span className="flex items-center gap-2">
                {season.label}
                <span
                  className={`
                  text-xs px-2 py-0.5 rounded-full
                  ${isActive ? "bg-white/20" : "bg-white/10"}
                `}
                >
                  {count}
                </span>
              </span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full -z-10"
                  transition={{
                    type: "spring",
                    bounce: 0.2,
                    duration: 0.6,
                  }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Season description */}
      <motion.p
        key={selectedSeason}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
        }}
        className="text-shark-muted text-center max-w-2xl"
      >
        {selectedSeason === "all"
          ? "Explore all the brilliant minds who have invested in India's entrepreneurial dreams"
          : `Discover the sharks who made Season ${selectedSeason} unforgettable`}
      </motion.p>
    </div>
  );
}

