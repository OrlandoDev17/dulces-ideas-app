import { motion, AnimatePresence } from "motion/react";
import { X, CheckCircle2, Calculator } from "lucide-react";
import { useState } from "react";
import { Button } from "../../common/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (monto: number) => void;
}

/**
 * Modal para registrar el monto de un cierre de caja.
 * Permite ingresar el monto recolectado en Bolívares.
 */
export function AddCierreModal({ isOpen, onClose, onConfirm }: Props) {
  const [monto, setMonto] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (monto && Number(monto) > 0) {
      onConfirm(Number(monto));
      onClose();
    }
  };

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
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl z-101 overflow-hidden border border-zinc-100"
          >
            {/* Header */}
            <div className="bg-primary-600 p-8 text-white relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12">
                <Calculator size={120} />
              </div>

              <div className="flex justify-between items-start relative z-10">
                <div className="flex flex-col gap-1">
                  <h3 className="text-2xl font-black">Agregar Cierre</h3>
                  <p className="text-white/70 text-sm font-medium">
                    Registra el ingreso de caja de hoy
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* Content */}
            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
                  Monto del Cierre (Bs.)
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 font-bold">
                    Bs.
                  </div>
                  <input
                    autoFocus
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={monto}
                    onChange={(e) => {
                      const val =
                        e.target.value === "" ? "" : Number(e.target.value);
                      setMonto(
                        typeof val === "number"
                          ? Math.round(val * 100) / 100
                          : "",
                      );
                    }}
                    className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl pl-12 pr-4 py-4 text-lg font-black text-zinc-800 focus:border-primary-500 focus:bg-white transition-all outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-4">
                <Button
                  style="primary"
                  type="submit"
                  disabled={!monto || Number(monto) <= 0}
                  className="w-full py-4 rounded-2xl shadow-xl shadow-primary-500/20"
                >
                  <CheckCircle2 size={20} className="mr-2" />
                  Registrar Cierre
                </Button>
                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-4 text-zinc-400 font-black uppercase tracking-widest text-xs hover:text-zinc-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
