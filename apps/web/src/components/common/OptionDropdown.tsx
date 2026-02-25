/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "motion/react";

interface Props<T> {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  onSelect: (value: T) => void;
  options: T[];
  // Función para extraer el nombre/label a mostrar
  getLabel: (option: T) => string;
  // Opcional: Función para extraer información extra (precio, descripción, etc.)
  getExtra?: (option: T) => React.ReactNode;
  maxHeight?: string;
}

export function OptionDropdown<T>({
  isOpen,
  setIsOpen,
  onSelect,
  options,
  getLabel,
  getExtra,
  maxHeight = "max-h-[400px]",
}: Props<T>) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          <motion.ul
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute z-50 mt-2 w-fit bg-white border border-primary-200 shadow-lg shadow-primary-500/50 rounded-xl 
            overflow-y-auto ${maxHeight}`}
          >
            {options.map((option: any, index: number) => (
              <li
                key={`${option.id || index}-${index}`}
                onClick={() => {
                  onSelect(option);
                  setIsOpen(false);
                }}
                className="flex justify-between items-center px-3 py-2.5 text-sm rounded-lg hover:bg-primary-500 hover:text-white cursor-pointer transition-colors group"
              >
                <span
                  className="font-medium truncate flex-1 min-w-0 mr-2"
                  title={getLabel(option)}
                >
                  {getLabel(option)}
                </span>

                {/* Solo renderiza la parte extra si la función existe */}
                {getExtra && (
                  <span className="text-xs opacity-70 group-hover:opacity-100">
                    {getExtra(option)}
                  </span>
                )}
              </li>
            ))}
          </motion.ul>
        </>
      )}
    </AnimatePresence>
  );
}
