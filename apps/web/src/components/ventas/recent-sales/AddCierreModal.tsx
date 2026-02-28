import { CheckCircle2, Calculator } from "lucide-react";
import { useState } from "react";
import { Button } from "../../common/Button";
import { Modal } from "../../common/Modal";

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

  // Función para cerrar el modal y resetear el estado
  const handleClose = () => {
    setMonto("");
    onClose();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (monto && Number(monto) > 0) {
      onConfirm(Number(monto));
      handleClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Agregar Cierre"
      description="Registra el ingreso de caja de hoy"
      icon={Calculator}
      footer={
        <>
          <Button
            style="primary"
            type="submit"
            form="add-cierre-form"
            disabled={!monto || Number(monto) <= 0}
            className="w-full py-4 rounded-2xl shadow-xl shadow-primary-500/20"
          >
            <CheckCircle2 size={20} className="mr-2" />
            Registrar Cierre
          </Button>
          <button
            type="button"
            onClick={handleClose}
            className="w-full py-4 text-zinc-400 font-black uppercase tracking-widest text-xs hover:text-zinc-600 transition-colors"
          >
            Cancelar
          </button>
        </>
      }
    >
      <form
        id="add-cierre-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-6"
      >
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
                const val = e.target.value === "" ? "" : Number(e.target.value);
                setMonto(
                  typeof val === "number" ? Math.round(val * 100) / 100 : "",
                );
              }}
              className="w-full bg-zinc-50 border-2 border-zinc-100 rounded-2xl pl-12 pr-4 py-4 text-lg font-black text-zinc-800 focus:border-primary-500 focus:bg-white transition-all outline-none font-mono"
            />
          </div>
        </div>
      </form>
    </Modal>
  );
}
