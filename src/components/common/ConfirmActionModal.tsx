"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Check } from "lucide-react";
import { Button } from "./Button";

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  icon?: React.ReactNode;
  confirmText?: string;
  cancelText?: string;
  type?: "primary" | "success" | "warning";
  isPending?: boolean;
}

export function ConfirmActionModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  icon = <Check size={32} strokeWidth={2.5} />,
  confirmText = "Confirmar",
  cancelText = "Cancelar",
  type = "primary",
  isPending = false,
}: ConfirmActionModalProps) {
  const typeStyles = {
    primary: "bg-primary-500 hover:bg-primary-600 border-primary-600 shadow-primary-500/20",
    success: "bg-emerald-500 hover:bg-emerald-600 border-emerald-600 shadow-emerald-500/20",
    warning: "bg-amber-500 hover:bg-amber-600 border-amber-600 shadow-amber-500/20",
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-100"
          >
            <div className={`${typeStyles[type]} p-8 text-white relative overflow-hidden flex flex-col items-center text-center`}>
              <div className="size-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                {icon}
              </div>

              <h2 className="text-xl font-black mb-1 relative z-10">{title}</h2>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 flex flex-col gap-6 text-center">
              <p className="text-zinc-500 text-sm font-bold leading-relaxed">
                {message}
              </p>

              <div className="flex flex-col gap-3">
                <Button
                  style="primary"
                  onClick={onConfirm}
                  disabled={isPending}
                  className={`${typeStyles[type]} py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl active:scale-95 transition-all outline-none!`}
                >
                  {isPending ? "Procesando..." : confirmText}
                </Button>
                <button
                  onClick={onClose}
                  disabled={isPending}
                  className="py-3 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  {cancelText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
