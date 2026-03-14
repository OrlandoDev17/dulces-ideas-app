import { useState, useRef } from "react";
import { OptionDropdown } from "../common/OptionDropdown";
import { ChevronDown } from "lucide-react";

interface OrderSelectProps<T> {
  label: string;
  value: T | null;
  onSelect: (value: T) => void;
  options: T[];
  getLabel: (option: T) => string;
  icon: React.ComponentType<{ className?: string; fill?: string }>;
  placeholder: string;
}

export function OrderSelect<T>({
  label,
  value,
  onSelect,
  options,
  getLabel,
  icon: Icon,
  placeholder,
}: OrderSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="flex flex-col gap-1 relative" ref={containerRef}>
      <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">
        {label}
      </span>
      <div className="relative w-full">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 pl-10 pr-10 border border-primary-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-left overflow-hidden whitespace-nowrap text-sm"
        >
          {value ? (
            <span className="text-foreground">{getLabel(value)}</span>
          ) : (
            <span className="text-gray-500">{placeholder}</span>
          )}
        </button>
        <Icon className="size-5 text-gray-700 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
        <ChevronDown className="size-5 text-gray-700 absolute top-1/2 -translate-y-1/2 right-3 pointer-events-none" />
      </div>

      <div className="relative">
        <OptionDropdown
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          onSelect={onSelect}
          options={options}
          getLabel={getLabel}
          className="w-full mt-1"
          maxHeight="max-h-[120px]"
        />
      </div>
    </div>
  );
}
