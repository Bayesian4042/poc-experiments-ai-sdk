 "use client";
 
 import { motion } from "framer-motion";
 import { ReactNode } from "react";
 
 interface OnboardingStepProps {
   children: ReactNode;
   onNext?: () => void;
   showNext?: boolean;
   nextLabel?: string;
   nextDisabled?: boolean;
 }
 
 export function OnboardingStep({
   children,
   onNext,
   showNext = true,
   nextLabel = "Continue",
   nextDisabled = false,
 }: OnboardingStepProps) {
   const handleKeyPress = (e: React.KeyboardEvent) => {
     if (e.key === "Enter" && !nextDisabled && onNext) {
       onNext();
     }
   };
 
   return (
     <motion.div
       initial={{ opacity: 0, y: 20 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: -20 }}
       transition={{ duration: 0.4, ease: "easeOut" }}
       className="flex flex-col items-center justify-center min-h-screen px-6 py-12 text-gray-900"
       onKeyDown={handleKeyPress}
     >
       <div className="w-full max-w-2xl">
         {children}
 
         {showNext && (
           <motion.button
             onClick={onNext}
             disabled={nextDisabled}
             className="mt-8 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-black rounded-xl font-semibold text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:from-yellow-500 hover:to-orange-600 transition-colors"
             whileHover={!nextDisabled ? { scale: 1.02, y: -2 } : {}}
             whileTap={!nextDisabled ? { scale: 0.98 } : {}}
           >
             {nextLabel}
           </motion.button>
         )}
 
         <p className="mt-6 text-gray-400 text-sm">
           Press{" "}
           <kbd className="px-2 py-1 bg-gray-100 rounded text-gray-600 font-mono">
             Enter ↵
           </kbd>
         </p>
       </div>
     </motion.div>
   );
 }

