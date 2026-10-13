"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PlusCircle, Smartphone } from "lucide-react";
import type { PaymentMethod } from "@/shared/types";
import { productsApi } from "@/api/products";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Se invoca con la cuenta recién creada para seleccionarla automáticamente */
  onCreated: (method: PaymentMethod) => void;
}

/**
 * Modal para crear una nueva cuenta de Pago Móvil al vuelo.
 * La cuenta se guarda como un método de pago (id `pm_<slug>`) en Supabase
 * y queda disponible de inmediato en los selectores y reportes del día.
 */
export function PaymentAccountModal({ isOpen, onClose, onCreated }: Props) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      const method = await productsApi.createPaymentAccount(name);
      queryClient.invalidateQueries({ queryKey: ["payment_methods"] });
      setName("");
      onCreated(method);
      onClose();
    } catch {
      setError("No se pudo crear la cuenta. Intenta de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nueva Cuenta Pago Móvil"
      description="Crea una cuenta para registrar los pagos que caen a este destino"
      icon={Smartphone}
      footer={
        <div className="flex gap-3">
          <Button
            style="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="w-1/3 py-4"
          >
            Cancelar
          </Button>
          <Button
            style="primary"
            onClick={handleCreate}
            disabled={!name.trim()}
            isLoading={isLoading}
            className="w-2/3 py-4"
          >
            <PlusCircle size={18} />
            Crear Cuenta
          </Button>
        </div>
      }
    >
      <label className="flex flex-col gap-2">
        <span className="text-xs font-bold uppercase text-zinc-400 tracking-wider ml-1">
          Nombre de la cuenta
        </span>
        <input
          type="text"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          placeholder="Ej. Johnnie, Jurídico, Banco X…"
          className="w-full bg-primary-50 border-2 border-primary-200 px-4 py-3.5 rounded-xl text-base font-bold text-zinc-800 outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-zinc-400 placeholder:font-medium"
        />
      </label>

      {error && (
        <p className="text-xs font-bold text-red-500 -mt-2">{error}</p>
      )}

      <p className="text-[11px] text-zinc-400 font-medium leading-relaxed">
        Aparecerá como “Bs - Pago Móvil (Nombre)” en el selector de pagos y se
        desglosará por separado en el panel de ingresos y en el PDF del día.
      </p>
    </Modal>
  );
}
