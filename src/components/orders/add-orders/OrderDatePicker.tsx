import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale";

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
  return (
    <label className="flex flex-col gap-1">
      <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">
        {label}
      </span>
      <div className="w-full relative">
        <DatePicker
          selected={selected}
          onChange={onChange}
          locale={es}
          dateFormat="dd/MM/yyyy"
          className="w-full px-4 py-2 pl-10 border border-primary-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-gray-500 cursor-pointer bg-white text-sm"
          placeholderText={placeholder}
          popperClassName="z-[1000]"
          popperPlacement="bottom-start"
          wrapperClassName="w-full"
        />
        <Icon className="size-5 text-gray-600 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
      </div>
    </label>
  );
}
