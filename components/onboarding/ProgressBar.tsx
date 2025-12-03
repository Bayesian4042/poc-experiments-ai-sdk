 "use client";
 
 import { motion } from "framer-motion";
 
 interface ProgressBarProps {
   currentStep: number;
   totalSteps: number;
 }
 
 export function ProgressBar({ currentStep, totalSteps }: ProgressBarProps) {
   const progress = Math.min(
     100,
     Math.max(0, (currentStep / Math.max(totalSteps - 1, 1)) * 100)
   );
 
   return (
     <div className="fixed top-0 left-0 right-0 z-50">
       <div className="h-1 bg-gray-100">
         <motion.div
           className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
           initial={{ width: 0 }}
           animate={{ width: `${progress}%` }}
           transition={{ duration: 0.5, ease: "easeOut" }}
         />
       </div>
     </div>
   );
 }
