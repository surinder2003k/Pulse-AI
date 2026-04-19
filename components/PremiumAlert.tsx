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
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={cn(
              "bg-white rounded-xl shadow-2xl border p-6 overflow-hidden relative",
              type === "error" ? "border-red-200" : "border-slate-200"
            )}
          >
            <div className="relative z-10 space-y-5">
              <div className="flex gap-4">
                <div className="mt-0.5">{icons[type]}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-900 text-sm mb-1">
                    {title}
                  </h4>
                  <p className="text-sm text-slate-500 leading-relaxed font-medium">
                    {message}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="h-8 w-8 rounded-md hover:bg-slate-100 flex items-center justify-center transition-all text-slate-400 hover:text-slate-900 shrink-0"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {onConfirm && (
                <div className="flex gap-3 pt-3 border-t border-slate-100">
                  <Button 
                    variant="ghost" 
                    onClick={onClose}
                    className="flex-1 h-10 text-xs font-semibold text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleConfirm}
                    className={cn(
                      "flex-1 h-10 text-xs font-semibold text-white shadow-sm transition-all",
                      type === "error" ? "bg-red-500 hover:bg-red-600" : "bg-primary hover:bg-primary/90"
                    )}
                  >
                    Confirm
                  </Button>
                </div>
              )}
            </div>

            {/* Progress Bar (only for auto-closing alerts) */}
            {!onConfirm && (
              <div className="absolute bottom-0 left-0 h-1 bg-slate-100 w-full overflow-hidden">
                <motion.div
                  className={cn(
                    "h-full",
                    type === "success" ? "bg-primary" : "bg-red-500"
                  )}
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
