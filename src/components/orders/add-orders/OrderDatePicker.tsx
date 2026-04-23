import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface OrderDatePickerProps {
  label: string;
  selected: Date | null;
  onChange: (date: Date | null) => void;
  icon: React.ComponentType<{ className?: string; fill?: string }>;
  placeholder: string;
}

export function OrderDatePicker({
  label,
  selected,
  onChange,
  icon: Icon,
  placeholder,
}: OrderDatePickerProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [viewDate, setViewDate] = useState(new Date());
  const [calendarOpen, setCalendarOpen] = useState(false);

  const monthName = viewDate.toLocaleString("es-VE", { month: "long" });
  const year = viewDate.getFullYear();
  const daysInMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth() + 1,
    0,
  ).getDate();
  const firstDayOfMonth = new Date(
    viewDate.getFullYear(),
    viewDate.getMonth(),
    1,
  ).getDay();

  const goToPrevMonth = () => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1),
    );
  };

  const goToNextMonth = () => {
    setViewDate(
      new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1),
    );
  };

  const handleSelectDay = (day: number) => {
    const newDate = new Date(
      viewDate.getFullYear(),
      viewDate.getMonth(),
      day,
    );
    onChange(newDate);
    setCalendarOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setCalendarOpen(false);
      }
    };
    if (calendarOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [calendarOpen]);

  const isSelectedDay = (day: number) => {
    if (!selected) return false;
    return (
      selected.getDate() === day &&
      selected.getMonth() === viewDate.getMonth() &&
      selected.getFullYear() === viewDate.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === viewDate.getMonth() &&
      today.getFullYear() === viewDate.getFullYear()
    );
  };

  const weekDays = ["D", "L", "M", "X", "J", "V", "S"];

  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">
        {label}
      </span>
      <div className="relative" ref={wrapperRef}>
        <button
          type="button"
          onClick={() => setCalendarOpen(!calendarOpen)}
          className="w-full px-4 py-2.5 pl-10 pr-10 border border-primary-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-left text-sm cursor-pointer hover:border-primary-400 transition-colors"
        >
          {selected ? (
            <span className="text-foreground font-medium">
              {selected.toLocaleDateString("es-VE", {
                weekday: "short",
                day: "numeric",
                month: "short",
              })}
            </span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </button>
        <Icon className="size-5 text-primary-600 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
        <ChevronDown className={`size-5 text-primary-600 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none transition-transform ${calendarOpen ? "rotate-180" : ""}`} />

        {calendarOpen && (
          <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-50 bg-white border border-zinc-200 rounded-2xl shadow-xl shadow-primary-500/15 p-4 w-[260px]">
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={goToPrevMonth}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all"
                aria-label="Mes anterior"
              >
                <ChevronLeft size={18} />
              </button>

              <span className="text-sm font-bold text-zinc-800 capitalize">
                {monthName} {year}
              </span>

              <button
                type="button"
                onClick={goToNextMonth}
                className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 transition-all"
                aria-label="Mes siguiente"
              >
                <ChevronRight size={18} />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
              {weekDays.map((day) => (
                <div
                  key={day}
                  className="text-[10px] font-bold text-zinc-400 text-center uppercase"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square" />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleSelectDay(day)}
                    className={`
                      aspect-square flex items-center justify-center text-sm rounded-xl transition-all font-semibold
                      ${isSelectedDay(day) 
                        ? "bg-primary-600 text-white shadow-md shadow-primary-600/30" 
                        : "text-zinc-700 hover:bg-primary-50 hover:text-primary-700"}
                      ${isToday(day) && !isSelectedDay(day) ? "ring-2 ring-primary-300 ring-inset" : ""}
                    `}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </label>
  );
}