"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X, Terminal, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";

interface PremiumAlertProps {
  type?: "success" | "error" | "info";
  title: string;
  message: string;
  isVisible: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  autoClose?: number;
}

export default function PremiumAlert({
  type = "success",
  title,
  message,
  isVisible,
  onClose,
  onConfirm,
  autoClose = 5000,
}: PremiumAlertProps) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    // Only auto-close if not a confirmation alert
    if (isVisible && autoClose && !onConfirm) {
      const startTime = Date.now();
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, 100 - (elapsed / autoClose) * 100);
        setProgress(remaining);
        if (remaining === 0) {
          clearInterval(interval);
          onClose();
        }
      }, 10);
      return () => clearInterval(interval);
    }
  }, [isVisible, autoClose, onClose, onConfirm]);

  const icons = {
    success: <CheckCircle2 className="h-6 w-6 text-primary" />,
    error: <AlertCircle className="h-6 w-6 text-primary" />,
    info: <Terminal className="h-6 w-6 text-white" />,
  };

  const handleConfirm = () => {
    if (onConfirm) onConfirm();
    onClose();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <div className="fixed bottom-8 right-8 z-[9999] max-w-sm w-full">
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9, rotateX: 45 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className={cn(
              "glass-premium rounded-[2rem] p-8 border-l-4 overflow-hidden relative group shadow-2xl",
              type === "success" ? "border-l-primary" : "border-l-primary/40"
            )}
          >
            {/* Background Glow */}
            <div className={cn(
              "absolute -top-1/2 -right-1/4 w-full h-full opacity-20 blur-[60px] rounded-full",
              type === "success" ? "bg-primary" : "bg-black"
            )} />

            <div className="relative z-10 space-y-6">
              <div className="flex gap-4">
                <div className="mt-1">{icons[type]}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black uppercase tracking-[0.3em] text-xs text-white mb-2 italic">
                    {title}
                  </h4>
                  <p className="text-xs text-white/60 leading-[1.6] font-medium italic">
                    {message}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all border border-white/10 active:scale-90 shrink-0"
                >
                  <X className="h-4 w-4 text-white" />
                </button>
              </div>

              {onConfirm && (
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="ghost" 
                    onClick={onClose}
                    className="flex-1 rounded-full h-12 border border-white/5 text-[10px] font-black uppercase tracking-widest italic"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirm}
                    className="flex-1 rounded-full h-12 bg-primary hover:bg-primary/90 text-white text-[10px] font-black uppercase tracking-widest italic shadow-lg active:scale-95 transition-all"
                  >
                    Confirm <ArrowRight className="ml-2 h-3 w-3" />
                  </Button>
                </div>
              )}
            </div>

            {/* Progress Bar (only for auto-closing alerts) */}
            {!onConfirm && (
              <div className="absolute bottom-0 left-0 h-1 bg-white/5 w-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
