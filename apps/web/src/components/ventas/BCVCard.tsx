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

  return (
    <article className="flex justify-between items-center gap-4 px-4 2xl:px-6 py-6 2xl:py-8 bg-white shadow-lg shadow-zinc-500/20 rounded-2xl border-l-4 border-primary">
      <h3 className="text-lg 2xl:text-xl text-primary font-semibold">
        Tasa del Día (BCV)
      </h3>
      <label className="flex items-center gap-2 text-zinc-500">
        Bs.
        <input
          className={`w-28 2xl:w-36 text-sm 2xl:text-base border border-primary text-primary font-medium rounded-lg px-2 py-3 focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-300 ${
            editando
              ? "border-b-2 border-primary outline-none"
              : "border-none pointer-events-none"
          }`}
          type="number"
          step="0.01"
          value={tasa}
          onChange={(e) => setTasa(parseFloat(e.target.value))}
        />
        <div className="flex items-center gap-2">
          <button
            onClick={fetchTasa}
            disabled={loading || editando}
            className="cursor-pointer"
          >
            <RefreshCcw
              className={`p-2 size-8 2xl:size-10 rounded-xl hover:bg-primary hover:text-cream transition-all duration-300 ${loading ? "animate-spin" : ""}`}
            />
          </button>
          <button
            onClick={() => setEditando(!editando)}
            className={`flex items-center justify-center p-2 size-8 2xl:size-10 rounded-xl transition-all duration-300 cursor-pointer ${
              editando
                ? "bg-green-500 text-white"
                : "hover:bg-primary hover:text-cream"
            }`}
          >
            {editando ? <Check size={20} /> : <Pencil size={20} />}
          </button>
        </div>
      </label>
      <div className="flex flex-col items-end">
        <span className="text-xs font-black uppercase text-zinc-400 tracking-tighter">
          Última Tasa
        </span>
        <span className="text-sm 2xl:text-base text-green-600 font-bold">
          {ultimaActualizacion || "Cargando..."}
        </span>
      </div>
    </article>
  );
}
