"use client";

import { useState, useEffect, useCallback } from "react";
import { Modal } from "@/components/common/Modal";
import { useTasaBCV } from "@/hooks/ui/useTasaBCV";
import { ArrowUpDown, Loader, RefreshCw } from "lucide-react";

interface CurrencyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CurrencyConverterModal({
  isOpen,
  onClose,
}: CurrencyConverterModalProps) {
  const { tasa, loading, ultimaActualizacion, fetchTasa } = useTasaBCV();
  const [usdInput, setUsdInput] = useState<string>("");
  const [vesInput, setVesInput] = useState<string>("");
  const [lastEdited, setLastEdited] = useState<"usd" | "ves" | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setUsdInput("");
      setVesInput("");
      setLastEdited(null);
    }
  }, [isOpen]);

  const handleUsdChange = useCallback(
    (value: string) => {
      setUsdInput(value);
      setLastEdited("usd");
      if (value === "" || value === ".") {
        setVesInput("");
        return;
      }
      const num = parseFloat(value);
      if (!isNaN(num) && tasa > 0) {
        setVesInput((num * tasa).toFixed(2));
      }
    },
    [tasa]
  );

  const handleVesChange = useCallback(
    (value: string) => {
      setVesInput(value);
      setLastEdited("ves");
      if (value === "" || value === ".") {
        setUsdInput("");
        return;
      }
      const num = parseFloat(value);
      if (!isNaN(num) && tasa > 0) {
        setUsdInput((num / tasa).toFixed(2));
      }
    },
    [tasa]
  );

  const handleSwap = () => {
    const currentUsd = usdInput;
    const currentVes = vesInput;
    setUsdInput(currentVes);
    setVesInput(currentUsd);
    setLastEdited((prev) => (prev === "usd" ? "ves" : "usd"));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Calculadora de Divisas"
      description="Convierte entre USD y Bolívares según la tasa BCV"
      icon={ArrowUpDown}
    >
      <div className="flex flex-col gap-5">
        {/* Tasa */}
        <div className="flex items-center justify-between bg-primary-50 rounded-xl p-3">
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
              Tasa BCV
            </span>
            <span className="text-lg font-black text-primary-600">
              {loading ? (
                <Loader size={18} className="animate-spin" />
              ) : tasa > 0 ? (
                `Bs. ${tasa.toFixed(2)}`
              ) : (
                "Sin datos"
              )}
            </span>
          </div>
          <button
            onClick={fetchTasa}
            disabled={loading}
            className="p-2 text-primary-600 hover:bg-primary-100 rounded-xl transition-colors disabled:opacity-50"
            title="Actualizar tasa"
          >
            <RefreshCw
              size={18}
              className={loading ? "animate-spin" : ""}
            />
          </button>
        </div>

        {ultimaActualizacion && (
          <p className="text-[10px] text-zinc-400 -mt-3 text-center">
            Última actualización: {ultimaActualizacion}
          </p>
        )}

        {/* Inputs */}
        <div className="flex flex-col gap-3">
          {/* USD */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
              Dólares (USD)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">
                $
              </span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={usdInput}
                onChange={(e) => handleUsdChange(e.target.value)}
                className="w-full pl-8 pr-4 py-3.5 rounded-xl border-2 border-zinc-200 focus:border-primary-500 focus:outline-none text-lg font-bold text-zinc-700 bg-zinc-50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>

          {/* Swap button */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="p-2.5 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors"
              title="Intercambiar"
            >
              <ArrowUpDown size={18} />
            </button>
          </div>

          {/* VES */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1">
              Bolívares (VES)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400 font-bold text-sm">
                Bs.
              </span>
              <input
                type="number"
                inputMode="decimal"
                placeholder="0.00"
                value={vesInput}
                onChange={(e) => handleVesChange(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border-2 border-zinc-200 focus:border-primary-500 focus:outline-none text-lg font-bold text-zinc-700 bg-zinc-50 transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
