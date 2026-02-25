"use client";

import { motion, AnimatePresence } from "motion/react";
import { X, Save, DollarSign, Calculator } from "lucide-react";
import { Sale } from "@/lib/types";
import { Button } from "@/components/common/Button";

interface Props {
  sale: Sale;
  isOpen: boolean;
  onClose: () => void;
  onSave: (bs: number, usd: number) => void;
  editValues: { bs: number; usd: number };
  onEditChange: { bs: (v: number) => void; usd: (v: number) => void };
}

export function EditSaleModal({
  sale,
  isOpen,
  onClose,
  onSave,
  editValues,
  onEditChange,
}: Props) {
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
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:max-w-md bg-white rounded-[2.5rem] shadow-2xl z-901 overflow-hidden border border-zinc-100"
          >
            {/* Header */}
            <div className="bg-primary-600 p-4 md:p-8 text-white relative overflow-hidden">
              <div className="absolute right-[-20px] top-[-20px] opacity-10 rotate-12">
                <Calculator size={120} />
              </div>

              <div className="flex justify-between items-start relative z-10">
                <div className="flex flex-col gap-1">
                  <h3 className="text-lg md:text-2xl font-black">
                    Editar Montos
                  </h3>
                  <p className="text-white/70 text-xs md:text-sm font-medium">
                    Venta del{" "}
                    {new Date(sale.fecha).toLocaleTimeString("es-VE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
            <div className="p-4 md:p-8 flex flex-col gap-4 md:gap-6">
              <div className="grid grid-cols-1 gap-4">
                {/* BS Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
                    Monto en Bolívares (Bs.)
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-primary-500 font-bold">
                      Bs.
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={
                        editValues.bs
                          ? Math.round(Number(editValues.bs) * 100) / 100
                          : ""
                      }
                      onChange={(e) => {
                        const val =
                          e.target.value === "" ? 0 : Number(e.target.value);
                        onEditChange.bs(Math.round(val * 100) / 100);
                      }}
                      className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl pl-12 pr-4 py-4 text-lg font-black text-zinc-800 focus:border-primary-500 focus:bg-white transition-all outline-none font-mono"
                    />
                  </div>
                </div>

                {/* USD Input */}
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
                    Monto en Dólares ($)
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 font-bold">
                      <DollarSign size={20} />
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={
                        editValues.usd
                          ? Math.round(Number(editValues.usd) * 100) / 100
                          : ""
                      }
                      onChange={(e) => {
                        const val =
                          e.target.value === "" ? 0 : Number(e.target.value);
                        onEditChange.usd(Math.round(val * 100) / 100);
                      }}
                      className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl pl-12 pr-4 py-4 text-lg font-black text-zinc-800 focus:border-green-500 focus:bg-white transition-all outline-none font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-3 md:mt-4">
                <Button
                  style="primary"
                  onClick={() => onSave(editValues.bs, editValues.usd)}
                  className="w-full py-4 rounded-2xl shadow-xl shadow-primary-500/20"
                >
                  <Save size={20} className="mr-2" />
                  Guardar Cambios
                </Button>
                <button
                  onClick={onClose}
                  className="w-full py-4 text-zinc-400 font-black uppercase tracking-widest text-xs hover:text-zinc-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
