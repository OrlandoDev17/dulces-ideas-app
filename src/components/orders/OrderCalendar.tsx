"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOrderCalendar } from "@/hooks/ui/useOrderCalendar";

interface OrderItem {
  delivery_date?: string;
  status: string;
  [key: string]: unknown;
}

interface Props {
  orders: OrderItem[] | undefined;
}

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-blue-500",
  paid: "bg-yellow-500",
  delivered: "bg-emerald-500",
};

const STATUS_ORDER = ["pending", "paid", "delivered"];

export function OrderCalendar({ orders }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { calendarData } = useOrderCalendar(orders, currentMonth);

  const monthName = currentMonth.toLocaleString("es-VE", { month: "long" });
  const year = currentMonth.getFullYear();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1,
  ).getDay();

  const goToPrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1),
    );
  };

  const weekDays = ["D", "L", "M", "X", "J", "V", "S"];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200/80 p-5 w-full max-w-xs shadow-sm shrink-0">
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPrevMonth}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all"
          aria-label="Mes anterior"
        >
          <ChevronLeft size={20} />
        </button>

        <span className="text-base font-bold text-zinc-800 capitalize">
          {monthName} {year}
        </span>

        <button
          onClick={goToNextMonth}
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all"
          aria-label="Mes siguiente"
        >
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-3">
        {weekDays.map((day) => (
          <div
            key={day}
            className="text-xs font-bold text-zinc-400 text-center uppercase"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square" />
        ))}

        {calendarData.map((dayData) => {
          const dayNum = parseInt(dayData.date.split("-")[2]);
          const hasOrders = dayData.count > 0;
          const isToday = dayData.date === new Date().toISOString().split("T")[0];

          return (
            <div
              key={dayData.date}
              className={`
                relative aspect-square flex items-center justify-center text-sm rounded-xl transition-all font-semibold
                ${hasOrders ? "bg-zinc-100 text-zinc-700" : "text-zinc-300"}
                ${isToday ? "ring-2 ring-primary-300 ring-inset" : ""}
              `}
            >
              {dayNum}

              {/* Puntos de estado */}
              {hasOrders && (
                <div className="absolute -bottom-1 flex gap-0.5">
                  {STATUS_ORDER.map((status) => {
                    const count = dayData.byStatus[status as keyof typeof dayData.byStatus];
                    if (count === 0) return null;
                    return (
                      <span
                        key={status}
                        className={`w-1.5 h-1.5 rounded-full ${STATUS_COLORS[status]} animate-pulse`}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-center gap-4 pt-3 border-t border-zinc-100">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span className="text-xs text-zinc-500">Pend</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-yellow-500" />
          <span className="text-xs text-zinc-500">Pag</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-zinc-500">Ent</span>
        </div>
      </div>
    </div>
  );
}
