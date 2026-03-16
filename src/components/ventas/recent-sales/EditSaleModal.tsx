"use client";

import { Save, DollarSign, Calculator } from "lucide-react";
import { Sale } from "@/lib/types";
import { Button } from "@/components/common/Button";
import { Modal } from "@/components/common/Modal";

interface Props {
  sale: Sale;
  isOpen: boolean;
  onClose: () => void;
  onSave: (bs: number, usd: number, usdPaymentRef?: number) => void;
  editValues: { bs: number; usd: number; usdPaymentRef: number | null };
  onEditChange: {
    bs: (v: number) => void;
    usd: (v: number) => void;
    usdPaymentRef: (v: number) => void;
  };
}

export function EditSaleModal({
  sale,
  isOpen,
  onClose,
  onSave,
  editValues,
  onEditChange,
}: Props) {
  const formattedTime = new Date(
    sale.created_at || sale.fecha || "",
  ).toLocaleTimeString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Bug 3: detectar si la venta tiene un pago en divisas
  const payments = sale.sale_payments || sale.payments || [];
  const hasUsdPayment = payments.some(
    (p) => p.currency === "USD" || p.method_id === "usd" || p.methodId === "usd",
  );

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
            onClick={() =>
              onSave(
                editValues.bs,
                editValues.usd,
                hasUsdPayment ? (editValues.usdPaymentRef ?? undefined) : undefined,
              )
            }
            className="w-full py-4 rounded-2xl shadow-xl shadow-primary-500/10"
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

        {/* USD Input (siempre visible para referencia) */}
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

        {/* Bug 3 Fix: Campo editable del pago en divisas cuando la venta fue pagada en USD */}
        {hasUsdPayment && (
          <div className="flex flex-col gap-2 border-t border-zinc-100 pt-4">
            <label className="text-xs font-black uppercase tracking-widest text-green-600 ml-1">
              💵 Pago en Divisas — Monto recibido ($)
            </label>
            <p className="text-[10px] text-zinc-400 font-bold ml-1 -mt-1">
              Edita el monto exacto recibido en dólares
            </p>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500 font-bold">
                <DollarSign size={20} />
              </div>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={
                  editValues.usdPaymentRef !== null && editValues.usdPaymentRef !== undefined
                    ? Math.round(editValues.usdPaymentRef * 100) / 100
                    : ""
                }
                onChange={(e) => {
                  const val = e.target.value === "" ? 0 : Number(e.target.value);
                  onEditChange.usdPaymentRef(Math.round(val * 100) / 100);
                }}
                className="w-full bg-green-50 border-2 border-green-200 rounded-2xl pl-12 pr-4 py-4 text-lg font-black text-zinc-800 focus:border-green-500 focus:bg-white transition-all outline-none font-mono"
              />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
