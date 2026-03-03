"use client";

import { useState } from "react";
import { PlusCircle, CheckCircle2, Loader2 } from "lucide-react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
  loading: boolean;
  error?: string | null;
}

export function CreateSessionModal({
  isOpen,
  onClose,
  onConfirm,
  loading,
  error,
}: Props) {
  const [sessionName, setSessionName] = useState("");

  const handleClose = () => {
    setSessionName("");
    onClose();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (sessionName.trim() && !loading) {
      onConfirm(sessionName.trim());
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Nueva Sesión"
      description="Crea una nueva sesión para empezar a vender"
      icon={PlusCircle}
      footer={
        <>
          <Button
            style="primary"
            type="submit"
            form="create-session-form"
            disabled={!sessionName.trim() || loading}
            className="w-full py-4 rounded-2xl shadow-xl shadow-primary-500/20"
          >
            {loading ? (
              <Loader2 size={20} className="mr-2 animate-spin" />
            ) : (
              <CheckCircle2 size={20} className="mr-2" />
            )}
            Crear Sesión
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
        id="create-session-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
      >
        <label className="text-xs font-black uppercase tracking-widest text-zinc-400 ml-1">
          Nombre de la Sesión / Caja
        </label>
        <input
          autoFocus
          type="text"
          placeholder="Ej: Turno Mañana, Caja Principal..."
          value={sessionName}
          onChange={(e) => setSessionName(e.target.value)}
          className={`w-full bg-zinc-50 border-2 rounded-2xl px-6 py-4 text-lg font-bold text-zinc-800 transition-all outline-none ${
            error
              ? "border-red-200 focus:border-red-500"
              : "border-zinc-100 focus:border-primary-500"
          }`}
        />
        {error && (
          <p className="text-red-500 text-xs font-bold mt-1 ml-1 flex items-center gap-1">
            <Loader2 className="size-3 animate-pulse" /> {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
