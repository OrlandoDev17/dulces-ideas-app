/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect } from "react";
import { PlusCircle, CheckCircle2 } from "lucide-react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (name: string) => void;
}

export function CreateSessionModal({ isOpen, onClose, onConfirm }: Props) {
  const [sessionName, setSessionName] = useState("");

  useEffect(() => {
    if (isOpen) {
      setSessionName("");
    }
  }, [isOpen]);

  const handleClose = () => {
    onClose();
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (sessionName.trim()) {
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
            disabled={!sessionName.trim()}
            className="w-full py-4 rounded-2xl shadow-xl shadow-primary-500/20"
          >
            <CheckCircle2 size={20} className="mr-2" />
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
          className={`w-full bg-zinc-50 border-2 rounded-2xl px-6 py-4 text-lg font-bold text-zinc-800 transition-all outline-none ${"border-zinc-100 focus:border-primary-500"}`}
        />
      </form>
    </Modal>
  );
}
