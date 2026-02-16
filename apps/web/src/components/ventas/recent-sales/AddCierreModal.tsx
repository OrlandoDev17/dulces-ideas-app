import { motion } from "motion/react";
import { X, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../../common/Button";

interface Props {
  onClose: () => void;
  onConfirm: (monto: number) => void;
}

/**
 * Modal para registrar el monto de un cierre de caja.
 * Permite ingresar el monto recolectado en Bolívares.
 */
export function AddCierreModal({ onClose, onConfirm }: Props) {
  const [monto, setMonto] = useState<number | "">("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (monto && Number(monto) > 0) {
      onConfirm(Number(monto));
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden"
      >
        <header className="bg-[#8B6D61] p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold uppercase tracking-tight">
              Agregar Cierre de Caja
            </h2>
            <p className="text-xs text-white/60 font-medium mt-1">
              Ingresa el monto recolectado en efectivo o transferencia
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/10 rounded-full transition-colors text-white/80 cursor-pointer"
          >
            <X size={20} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-widest ml-1">
              Monto del Cierre (Bs.)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold">
                Bs.
              </span>
              <input
                autoFocus
                type="number"
                step="0.01"
                placeholder="0.00"
                value={monto}
                onChange={(e) =>
                  setMonto(e.target.value === "" ? "" : Number(e.target.value))
                }
                className="w-full bg-zinc-50 border-2 border-zinc-100 pl-12 pr-6 py-4 rounded-2xl text-xl font-black outline-none focus:border-[#8B6D61]/30 focus:ring-4 focus:ring-[#8B6D61]/10 transition-all font-mono"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <Button style="secondary" onClick={onClose} className="flex-1">
              Cancelar
            </Button>
            <Button
              style="primary"
              type="submit"
              disabled={!monto || Number(monto) <= 0}
              className="flex-1 bg-[#8B6D61]! hover:bg-[#75594e]! border-none"
            >
              Registrar Cierre
              <CheckCircle2 size={18} />
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
