import { motion } from "motion/react";
import { CartItem, Payment } from "@/lib/types";
import { CheckCircle2, Package, User, Calendar, CreditCard, PieChart } from "lucide-react";

interface OrderStep3SummaryProps {
  cart: CartItem[];
  payments: Payment[];
  customerName: string;
  customerPhone: string;
  description: string;
  deliveryTime: string;
  deliveryDate: Date | null;
  tasa: number;
}

export function OrderStep3Summary({
  cart,
  payments,
  customerName,
  customerPhone,
  description,
  deliveryTime,
  deliveryDate,
  tasa,
}: OrderStep3SummaryProps) {
  const subtotalUsd = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalAdvancesUsd = payments.reduce((acc, p) => acc + (p.amountRef || 0) + (p.amountBs / tasa || 0), 0);
  const remainingUsd = Math.max(0, subtotalUsd - totalAdvancesUsd);
  
  const paymentPercentage = subtotalUsd > 0 ? (totalAdvancesUsd / subtotalUsd) * 100 : 0;

  // Distribución por categoría (Simulado para el chart)
  const itemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-6"
    >
      {/* Resumen de Entrega */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100 shadow-sm transition-all hover:border-primary-100">
          <div className="flex items-center gap-2 mb-2 text-primary-600">
            <div className="bg-primary-100 p-1 rounded-lg">
              <User size={12} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Cliente</span>
          </div>
          <p className="text-sm font-black text-zinc-900 truncate">{customerName || "N/A"}</p>
          <p className="text-[10px] text-zinc-500 font-medium">{customerPhone || "Sin teléfono"}</p>
        </div>
        <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100 shadow-sm transition-all hover:border-primary-100">
          <div className="flex items-center gap-2 mb-2 text-primary-600">
            <div className="bg-primary-100 p-1 rounded-lg">
              <Calendar size={12} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">Entrega</span>
          </div>
          <p className="text-sm font-black text-zinc-900">
            {deliveryDate ? deliveryDate.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }) : "No definida"}
          </p>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
            {deliveryTime || "--:--"}
          </p>
        </div>
      </div>

      {/* Notas / Descripción */}
      {description && (
        <div className="bg-zinc-50 p-3 rounded-2xl border border-zinc-100 border-l-4 border-l-primary-400">
          <div className="flex items-center gap-2 mb-1 text-zinc-500">
            <Package size={12} />
            <span className="text-[9px] font-bold uppercase tracking-widest">Notas del pedido</span>
          </div>
          <p className="text-[11px] text-zinc-600 italic leading-relaxed">&quot;{description}&quot;</p>
        </div>
      )}

      {/* Analíticas del Pedido (Charts) */}
      <div className="grid grid-cols-2 gap-4">
        {/* Estado del Pago Chart */}
        <div className="bg-white border border-zinc-100 rounded-3xl p-4 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
             <div className="bg-green-100 p-1.5 rounded-xl text-green-600 group-hover:scale-110 transition-transform">
               <PieChart size={16} />
             </div>
             <span className="text-[10px] font-black text-green-600">{paymentPercentage.toFixed(0)}%</span>
          </div>
          <h4 className="font-bold text-zinc-800 text-[11px] mb-2">Abonado del Total</h4>
          <div className="relative h-2 bg-zinc-100 rounded-full overflow-hidden mb-2">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, paymentPercentage)}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-green-400 to-green-600"
            />
          </div>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
            ${totalAdvancesUsd.toFixed(2)} de ${subtotalUsd.toFixed(2)}
          </p>
        </div>

        {/* Distribución Chart Simplificado */}
        <div className="bg-white border border-zinc-100 rounded-3xl p-4 shadow-sm relative overflow-hidden group">
          <div className="flex items-center justify-between mb-3">
             <div className="bg-primary-100 p-1.5 rounded-xl text-primary-600 group-hover:scale-110 transition-transform">
               <Package size={16} />
             </div>
             <span className="text-[10px] font-black text-primary-600">{itemsCount}</span>
          </div>
          <h4 className="font-bold text-zinc-800 text-[11px] mb-2">Total Productos</h4>
          <div className="flex gap-0.5 h-2 mb-2">
            {cart.map((item, idx) => (
              <div 
                key={item.id} 
                className="h-full bg-primary-400 first:rounded-l-full last:rounded-r-full"
                style={{ width: `${(item.quantity / itemsCount) * 100}%`, opacity: 1 - (idx * 0.15) }}
              />
            ))}
            {cart.length === 0 && <div className="w-full h-full bg-zinc-100 rounded-full" />}
          </div>
          <p className="text-[9px] font-bold text-zinc-400 uppercase tracking-tighter">
            {cart.length} tipos items
          </p>
        </div>
      </div>

      {/* Desglose de Totales */}
      <div className="bg-linear-to-br from-primary-500 to-primary-700 rounded-3xl p-6 text-white shadow-xl shadow-primary-500/20 relative overflow-hidden active:scale-[0.98] transition-transform cursor-default">
        <div className="absolute -top-6 -right-6 p-4 opacity-10">
          <CreditCard size={120} />
        </div>
        <div className="flex justify-between items-center mb-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-100">Valor del Pedido</span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-black">$</span>
              <span className="text-4xl font-black tracking-tighter">{subtotalUsd.toFixed(2)}</span>
            </div>
          </div>
          <div className="text-right bg-white/10 backdrop-blur-md px-3 py-2 rounded-2xl border border-white/20">
            <p className="text-[9px] font-bold uppercase tracking-widest text-primary-100 mb-0.5">Bolívares</p>
            <p className="text-lg font-black leading-none">Bs {(subtotalUsd * tasa).toLocaleString('es-ES', { minimumFractionDigits: 2 })}</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-white/10 flex justify-between items-center">
          <div className="flex gap-4">
             <div className="flex flex-col">
               <span className="text-[9px] font-bold text-primary-200 uppercase tracking-tighter">Abonado</span>
               <span className="text-sm font-black text-white">${totalAdvancesUsd.toFixed(2)}</span>
             </div>
             <div className="flex flex-col">
               <span className="text-[9px] font-bold text-primary-200 uppercase tracking-tighter">Pendiente</span>
               <span className="text-sm font-black text-white/90 underline decoration-red-400 decoration-2 underline-offset-2">${remainingUsd.toFixed(2)}</span>
             </div>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-[9px] font-bold text-primary-200 uppercase tracking-tighter text-right">Tasa BCV del día</span>
            <span className="text-xs font-bold text-white/80">Bs {tasa}</span>
          </div>
        </div>
      </div>

      {/* Confirmación Final */}
      <div className="flex flex-col items-center text-center gap-2 py-2">
        <div className="bg-primary-50 p-3 rounded-full text-primary-600 animate-pulse">
          <CheckCircle2 size={32} />
        </div>
        <p className="text-sm font-black text-zinc-800">¿Guardar Encargo?</p>
        <p className="text-[10px] text-zinc-500 max-w-[220px] font-medium leading-relaxed">
          Los anticipos se registrarán automáticamente en la caja del turno actual.
        </p>
      </div>
    </motion.div>
  );
}
