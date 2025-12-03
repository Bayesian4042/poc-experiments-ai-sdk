"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { UserProfileHeader } from "@/components/auth/user-profile-header";
import { SharkCard } from "@/components/shark/SharkCard";
import { SeasonFilter } from "@/components/shark/SeasonFilter";
import { sharksList } from "@/app/constants/sharks-list";

export default function Home() {
  const [selectedSeason, setSelectedSeason] = useState<number | "all">("all");

  const filteredSharks =
    selectedSeason === "all"
      ? sharksList
      : sharksList.filter((shark) =>
          shark.seasons.includes(selectedSeason as number)
        );

const seasonOptions: Array<{ value: number | "all"; label: string }> = [
  { value: "all", label: "All Seasons" },
  { value: 4, label: "Season 4" },
  { value: 3, label: "Season 3" },
  { value: 2, label: "Season 2" },
  { value: 1, label: "Season 1" },
];

const seasonCounts: Record<number | "all", number> = {
  all: sharksList.length,
  1: sharksList.filter((s) => s.seasons.includes(1)).length,
  2: sharksList.filter((s) => s.seasons.includes(2)).length,
  3: sharksList.filter((s) => s.seasons.includes(3)).length,
  4: sharksList.filter((s) => s.seasons.includes(4)).length,
};

  return (
    <div className="min-h-screen w-full gradient-sony-bg">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-shark">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="text-2xl font-bold heading-shark"
          >
            Shark Tank India
          </motion.div>
          <div className="flex-1 flex justify-end">
            <UserProfileHeader />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-24 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 heading-shark leading-tight"
          >
            Shark Tank India
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="text-xl md:text-2xl text-shark-muted mb-12 max-w-3xl mx-auto"
          >
            Meet the titans of industry looking to invest in the next big idea.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.4,
            }}
            className="flex flex-wrap gap-4 justify-center"
          >
            <Link href="/auth">
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 30px rgba(59, 130, 246, 0.5)",
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="px-8 py-4 btn-shark-primary text-lg"
              >
                Get Started
              </motion.button>
            </Link>
            <Link href="/chat">
              <motion.button
                whileHover={{
                  scale: 1.05,
                }}
                whileTap={{
                  scale: 0.95,
                }}
                className="px-8 py-4 btn-shark-secondary text-lg"
              >
                AI Assistant
              </motion.button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Season Filter */}
      <section className="px-6 pb-12">
        <div className="max-w-7xl mx-auto">
              <SeasonFilter
                selectedSeason={selectedSeason}
                onSeasonChange={setSelectedSeason}
                sharkCounts={seasonCounts}
                seasonOptions={seasonOptions}
              />
        </div>
      </section>

      {/* Sharks Grid */}
      <section className="px-6 pb-20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredSharks.map((shark, index) => (
                <SharkCard key={shark.id} shark={shark} index={index} />
              ))}
            </AnimatePresence>
          </motion.div>

          {filteredSharks.length === 0 && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              className="text-center py-20"
            >
              <p className="text-shark-muted text-xl">
                No sharks found for this season
              </p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 glass-shark">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center text-shark-muted">
            <p className="mb-2">
              © {new Date().getFullYear()} Shark Tank India. All rights reserved.
            </p>
            <p className="text-sm">Empowering entrepreneurs across India</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
