/* eslint-disable @typescript-eslint/no-explicit-any */
import { AnimatePresence, motion } from "motion/react";
import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

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
  className?: string;
  direction?: "up" | "down";
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function OptionDropdown<T>({
  isOpen,
  setIsOpen,
  onSelect,
  options,
  getLabel,
  getExtra,
  maxHeight = "max-h-[200px] md:max-h-[400px]",
  className = "mt-2",
  direction = "down",
  triggerRef,
}: Props<T>) {
  const [mounted, setMounted] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  useEffect(() => {
    const r = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(r);
  }, []);

  useEffect(() => {
    if (isOpen && triggerRef?.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setCoords({
        top: direction === "down" ? rect.bottom + window.scrollY : rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  }, [isOpen, triggerRef, direction]);

  const yOffset = direction === "up" ? 10 : -10;

  if (!mounted) return null;

  const dropdownContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {triggerRef && (
            <div
              className="fixed inset-0 z-1000"
              onClick={() => setIsOpen(false)}
            />
          )}

          <motion.ul
            initial={{ opacity: 0, y: yOffset }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: yOffset }}
            style={
              triggerRef
                ? {
                    top:
                      direction === "down" ? coords.top : "auto",
                    bottom:
                      direction === "up"
                        ? window.innerHeight - coords.top + window.scrollY
                        : "auto",
                    left: coords.left,
                    width: coords.width,
                    position: "absolute",
                  }
                : { position: "absolute" }
            }
            className={`${triggerRef ? "z-1001" : "z-50"} bg-white border border-primary-200 shadow-xl shadow-primary-500/30 rounded-2xl 
            overflow-y-auto ${maxHeight} ${className}`}
          >
            {options.length > 0 ? (
              options.map((option: any, index: number) => (
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
              ))
            ) : (
              <li className="px-3 py-4 text-center text-zinc-400 text-xs italic">
                No se encontraron resultados
              </li>
            )}
          </motion.ul>
        </>
      )}
    </AnimatePresence>
  );

  if (triggerRef) {
    return createPortal(dropdownContent, document.body);
  }

  return dropdownContent;
}
