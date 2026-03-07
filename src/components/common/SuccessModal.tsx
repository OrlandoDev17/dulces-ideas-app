"use client";

import { motion } from "motion/react";
import { CheckCircle2, PartyPopper } from "lucide-react";
import { Modal } from "./Modal";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  message,
}: SuccessModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} icon={PartyPopper}>
      <div className="flex flex-col items-center text-center gap-6 py-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="size-20 bg-green-100 text-green-600 rounded-4xl flex items-center justify-center shadow-lg shadow-green-500/10"
        >
          <CheckCircle2 size={40} strokeWidth={3} />
        </motion.div>

        <p className="text-zinc-500 text-sm font-bold leading-relaxed px-4">
          {message}
        </p>

        {/* Barra de progreso de cierre automático */}
        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50 mt-2">
          <motion.div
            initial={{ width: "100%" }}
            animate={{ width: "0%" }}
            transition={{ duration: 1, ease: "linear" }}
            onAnimationComplete={onClose}
            className="h-full bg-green-500 rounded-full"
          />
        </div>
      </div>
    </Modal>
  );
}
