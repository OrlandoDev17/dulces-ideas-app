import { ChevronDown } from "lucide-react";

interface Props {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children?: React.ReactNode;
}

export function DropdownButton({ isOpen, setIsOpen, children }: Props) {
  return (
    <button
      onClick={() => setIsOpen(!isOpen)}
      className="w-full flex items-center justify-between bg-white border border-primary-200 rounded-xl px-4 py-3.5 text-sm font-bold text-primary-700 hover:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-600 transition-all cursor-pointer shadow-sm shadow-primary-500/30 overflow-hidden"
    >
      <div className="flex items-center gap-2">{children}</div>
      <ChevronDown
        size={16}
        className={`transition-transform text-primary-500 ${isOpen ? "rotate-180" : ""}`}
      />
    </button>
  );
}
