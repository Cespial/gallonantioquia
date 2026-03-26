"use client";

import { useEffect } from "react";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
}

export default function Toast({ message, visible, onClose }: ToastProps) {
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    return () => clearTimeout(timer);
  }, [visible, onClose]);

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 bg-verde-antioquia text-white rounded-card shadow-xl p-4 pr-10 flex items-center gap-3 transition-all duration-300",
        visible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 pointer-events-none"
      )}
    >
      <Check size={18} strokeWidth={2.5} className="shrink-0" />
      <span className="font-heading text-sm">{message}</span>
      <button
        onClick={onClose}
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Cerrar notificación"
      >
        <X size={14} />
      </button>
    </div>
  );
}
