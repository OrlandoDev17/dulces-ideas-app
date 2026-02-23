"use client";

// Hooks
import { useTasaBCV } from "@/hooks/useTasaBCV";
// Icons
import { Check, Pencil, RefreshCcw } from "lucide-react";

export function BCVCard() {
  const {
    tasa,
    setTasa,
    loading,
    editando,
    setEditando,
    fetchTasa,
    ultimaActualizacion,
  } = useTasaBCV();

  const tasaRounded = Math.round(tasa * 100) / 100;

  return (
    <article className="flex justify-between items-center gap-4 px-6 py-8 bg-white border-l-8 border-primary-500 rounded-3xl shadow-lg shadow-primary-500/20">
      <h3 className="text-xl text-primary font-black tracking-tight">
        Tasa del Día (BCV)
      </h3>
      <label className="flex items-center gap-3 text-primary-500 font-bold uppercase tracking-tighter text-xs">
        Bs.
        <input
          className={`w-32 2xl:w-36 text-lg 2xl:text-xl border-2 border-zinc-200 font-black rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-300 tabular-nums ${
            editando ? "border-primary-500" : "border-zinc-200 cursor-default"
          }`}
          aria-label="Monto de la tasa en Bolívares"
          type="number"
          step="0.01"
          value={tasaRounded}
          readOnly={!editando}
          onChange={(e) => setTasa(parseFloat(e.target.value))}
        />
        <div className="flex items-center gap-3 ml-2">
          <button
            onClick={fetchTasa}
            disabled={loading || editando}
            aria-label="Actualizar tasa desde el BCV"
            className="group cursor-pointer p-2.5 rounded-2xl hover:bg-primary-500 hover:text-primary-50 transition-all active:scale-90 disabled:opacity-30"
          >
            <RefreshCcw
              className={`size-6 2xl:size-7 text-primary-500 transition-transform duration-500 group-hover:rotate-180 ${loading ? "animate-spin" : ""}`}
              aria-hidden="true"
            />
          </button>
          <button
            onClick={() => setEditando(!editando)}
            aria-label={
              editando ? "Guardar cambios" : "Editar tasa manualmente"
            }
            className={`flex items-center justify-center p-2.5 size-10 2xl:size-12 rounded-2xl transition-all duration-300 cursor-pointer active:scale-90 ${
              editando
                ? "bg-primary-500 text-white shadow-lg shadow-primary/20"
                : "text-primary-500 hover:bg-primary-500 hover:text-white"
            }`}
          >
            {editando ? (
              <Check size={24} aria-hidden="true" />
            ) : (
              <Pencil size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </label>
      <div className="flex flex-col items-end gap-1">
        <span className="text-[10px] font-black uppercase text-zinc-400 tracking-widest bg-zinc-100 px-2 py-1 rounded-md">
          Última Actualización
        </span>
        <span className="text-sm 2xl:text-base text-zinc-600 font-black tabular-nums">
          {ultimaActualizacion || "Cargando…"}
        </span>
      </div>
    </article>
  );
}
