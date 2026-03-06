"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, AlertCircle, Trash2 } from "lucide-react";
import { Button } from "./Button";

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isPending?: boolean;
}

export function ConfirmDeleteModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isPending = false,
}: ConfirmDeleteModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative bg-white w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl border border-zinc-100"
          >
            {/* Cabecera de Alerta */}
            <div className="bg-red-500 p-8 text-white relative overflow-hidden flex flex-col items-center text-center">
              <div className="absolute -right-4 -top-4 opacity-10 rotate-12">
                <Trash2 size={120} />
              </div>

              <div className="size-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-md">
                <AlertCircle size={32} strokeWidth={2.5} />
              </div>

              <h2 className="text-xl font-black mb-1 relative z-10">{title}</h2>
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                aria-label="Cerrar"
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
                  className="bg-red-500 hover:bg-red-600 border-red-600 py-4 rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-red-500/20 active:scale-95 transition-all outline-none!"
                >
                  {isPending ? "Eliminando..." : "Sí, Eliminar"}
                  <Trash2 size={18} />
                </Button>
                <button
                  onClick={onClose}
                  disabled={isPending}
                  className="py-3 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-zinc-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
