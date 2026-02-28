import { motion, AnimatePresence } from "motion/react";
import { X, LucideIcon } from "lucide-react";
import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: LucideIcon;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({
  isOpen,
  onClose,
  title,
  description,
  icon: Icon,
  children,
  footer,
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-900 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:max-w-md bg-white rounded-[2.5rem] shadow-2xl z-901 overflow-hidden border border-zinc-100 flex flex-col max-h-[90vh]"
          >
            {/* Header - Fixed */}
            <div className="bg-primary-600 p-4 md:p-8 text-white relative overflow-hidden shrink-0">
              {Icon && (
                <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12">
                  <Icon size={120} />
                </div>
              )}

              <div className="flex justify-between items-start relative z-10">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg md:text-2xl font-black">{title}</h3>
                  {description && (
                    <p className="text-white/70 text-xs md:text-sm font-medium">
                      {description}
                    </p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto pretty-scrollbar p-4 md:p-8 flex flex-col gap-4 md:gap-6">
              {children}
            </div>

            {/* Footer - Fixed if present */}
            {footer && (
              <div className="p-4 md:px-8 md:pb-8 flex flex-col gap-3 shrink-0">
                {footer}
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
