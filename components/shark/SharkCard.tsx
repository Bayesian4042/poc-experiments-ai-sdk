"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface Shark {
  id?: number;
  name: string;
  role: string;
  image: string;
  slug: string;
  bio?: string;
  investment?: string;
}

interface SharkCardProps {
  shark: Shark;
  index: number;
}

export function SharkCard({ shark, index }: SharkCardProps) {
  const [isNavigating, setIsNavigating] = useState(false);

  const handleLinkClick = () => {
    setIsNavigating(true);
  };

  return (
    <Link
      href={`/shark/${shark.slug}`}
      className="block"
      onClick={handleLinkClick}
      aria-busy={isNavigating}
    >
      <motion.div
        layout
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          scale: 0.9,
        }}
        transition={{
          duration: 0.4,
          delay: index * 0.1,
          layout: {
            duration: 0.3,
          },
        }}
        whileHover={{
          y: -8,
        }}
        className="group relative glass-shark rounded-2xl overflow-hidden border border-shark-border hover:border-yellow-500/50 transition-all duration-300 cursor-pointer"
      >
        {/* Loading overlay */}
        {isNavigating && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60">
            <div className="flex flex-col items-center text-white space-y-2">
              <span className="text-lg font-semibold">Loading...</span>
              <div className="h-4 w-16 rounded-full border border-white animate-pulse" />
            </div>
          </div>
        )}

        {/* Image */}
        <div className="relative h-64 overflow-hidden">
          <motion.div
            whileHover={{
              scale: 1.1,
            }}
            transition={{
              duration: 0.6,
            }}
            className="w-full h-full"
          >
            <Image
              src={shark.image}
              alt={shark.name}
              fill
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

          {/* Investment badge - shows on hover */}
          {shark.investment && (
            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              whileHover={{
                opacity: 1,
                y: 0,
              }}
              className="absolute bottom-4 left-4 right-4 bg-white/10 backdrop-blur-md rounded-lg px-3 py-2 border border-white/20"
            >
              <p className="text-white font-semibold text-sm">{shark.investment}</p>
            </motion.div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-orange-500 group-hover:bg-clip-text transition-all">
            {shark.name}
          </h3>
          <p className="text-yellow-400 font-medium mb-3 text-sm">{shark.role}</p>
          {shark.bio && (
            <p className="text-shark-muted text-sm leading-relaxed">{shark.bio}</p>
          )}

          {/* View Profile button - appears on hover */}
          <motion.div
            initial={{
              opacity: 0,
              y: 10,
            }}
            className="mt-4 w-full py-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg text-black font-medium opacity-0 group-hover:opacity-100 transition-opacity text-center"
          >
            View Profile
          </motion.div>
        </div>

        {/* Glow effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-orange-500/10" />
        </div>
      </motion.div>
    </Link>
  );
}

