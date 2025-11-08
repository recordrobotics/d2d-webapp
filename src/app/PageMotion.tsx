"use client";

import { motion } from "motion/react";
import { ReactNode } from "react";

export default function PageMotion({ children }: { children: ReactNode }) {
  return (
    <motion.main
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -100, opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.main>
  );
}
