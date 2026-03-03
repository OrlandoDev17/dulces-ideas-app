"use client";

import { Save, DollarSign, Calculator } from "lucide-react";
import { Sale } from "@/lib/types";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";

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
  const formattedTime = new Date(sale.fecha).toLocaleTimeString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Editar Montos"
      description={`Venta del ${formattedTime}`}
      icon={Calculator}
      footer={
        <>
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
        </>
      }
    >
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
                const val = e.target.value === "" ? 0 : Number(e.target.value);
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
                const val = e.target.value === "" ? 0 : Number(e.target.value);
                onEditChange.usd(Math.round(val * 100) / 100);
              }}
              className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl pl-12 pr-4 py-4 text-lg font-black text-zinc-800 focus:border-green-500 focus:bg-white transition-all outline-none font-mono"
            />
          </div>
        </div>
      </div>
    </Modal>
  );
}
