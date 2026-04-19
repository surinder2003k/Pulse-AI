"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: "danger" | "primary";
  icon?: React.ReactNode;
}

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger",
  icon,
}: ConfirmationModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] rounded-[2rem] border-slate-200 shadow-2xl p-8 gap-6 animate-in fade-in zoom-in-95 duration-300">
        <DialogHeader className="space-y-4">
          <div className={cn(
            "h-14 w-14 rounded-2xl flex items-center justify-center mx-auto mb-2",
            variant === "danger" ? "bg-red-50 text-red-500" : "bg-primary/5 text-primary"
          )}>
            {icon ? icon : (variant === "danger" ? <AlertTriangle className="h-7 w-7" /> : <ShieldCheck className="h-7 w-7" />)}
          </div>
          <DialogTitle className="text-2xl font-black text-center text-slate-900 uppercase tracking-tight">
            {title}
          </DialogTitle>
          <DialogDescription className="text-center text-slate-500 font-medium leading-relaxed px-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="sm:justify-center gap-3 flex flex-row w-full mt-2">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 h-12 rounded-xl border-slate-200 text-slate-600 font-bold uppercase tracking-widest text-[10px] hover:bg-slate-50 transition-all"
          >
            {cancelLabel}
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={cn(
              "flex-1 h-12 rounded-xl text-white font-bold uppercase tracking-widest text-[10px] shadow-lg transition-all active:scale-95",
              variant === "danger" 
                ? "bg-red-500 hover:bg-red-600 shadow-red-200" 
                : "bg-primary hover:bg-primary/90 shadow-primary/20"
            )}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
