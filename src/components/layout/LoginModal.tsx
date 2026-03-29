/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useRef, useEffect } from "react";
import { Cake, Loader2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useStore } from "@/context/StoreContext";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [pin, setPin] = useState<string[]>(new Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const { loginToStore, isLoading } = useStore();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      // Focus first input on open
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    } else {
      setPin(new Array(6).fill(""));
    }
  }, [isOpen]);

  const handleChange = async (value: string, index: number) => {
    // Solo permitir numeros
    const digit = value.replace(/[^0-9]/g, "").slice(-1);

    const newPin = [...pin];
    newPin[index] = digit;
    setPin(newPin);
    setError(null);

    // Filtrar al siguiente input
    if (digit !== "" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Si es el ultimo digito y estan todos llenos, intentar login
    if (index === 5 && digit !== "" && newPin.every((d) => d !== "")) {
      handleLogin(newPin.join(""));
    }
  };

  const handleLogin = async (passcode: string) => {
    const result = await loginToStore(passcode);
    if (!result.success) {
      setError(result.error || "PIN incorrecto");
      setPin(new Array(6).fill(""));
      inputRefs.current[0]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !pin[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.select();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-900 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          />
          <motion.article
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              x: error ? [0, -10, 10, -10, 10, 0] : 0,
            }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:max-w-md bg-white rounded-4xl 
            shadow-2xl z-901 overflow-hidden border border-zinc-100 max-h-[90vh] flex flex-col gap-4 items-center justify-center p-8"
          >
            <header className="flex flex-col gap-4 items-center justify-center border-b border-primary-200 pb-6 w-full">
              <div className="p-4 bg-primary-50 rounded-2xl transition-transform hover:scale-110 duration-500">
                <Cake className="text-primary-600 size-12" />
              </div>
              <div className="flex flex-col text-center">
                <h3 className="text-zinc-900 text-2xl font-black tracking-tight">
                  Bienvenido a Dulces Ideas
                </h3>
                <p className="text-zinc-500 font-medium">
                  Inicia sesión con tu pin de 6 dígitos
                </p>
              </div>
            </header>

            <div className="flex flex-col gap-6 items-center justify-center mt-4 w-full">
              <label
                htmlFor="pin-0"
                className="text-xs text-zinc-400 font-bold uppercase tracking-[0.2em]"
              >
                Ingresa tu PIN
              </label>

              {error && (
                <p className="text-red-500 text-sm font-bold -mt-4">{error}</p>
              )}

              <div className="flex gap-3 md:gap-4">
                {pin.map((digit, index) => (
                  <div
                    key={index}
                    className={`size-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center
                      ${
                        digit
                          ? "border-primary-600 bg-primary-600 shadow-xl shadow-primary-200 ring-2 ring-primary-50"
                          : "border-zinc-200 bg-white"
                      }
                      focus-within:border-primary-500 focus-within:ring-4 focus-within:ring-primary-50
                    `}
                  >
                    <input
                      id={`pin-${index}`}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="password"
                      inputMode="numeric"
                      autoComplete="off"
                      value={digit}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyDown={(e) => handleKeyDown(e, index)}
                      onFocus={handleFocus}
                      className={`w-full h-full text-center bg-transparent focus:outline-none font-bold text-xl caret-transparent selection:bg-transparent
                        ${digit ? "text-white" : "text-zinc-900"}
                      `}
                      maxLength={1}
                    />
                  </div>
                ))}
              </div>

              <div className="w-full flex flex-col gap-2 mt-4 text-center">
                <button
                  disabled={pin.some((d) => d === "") || isLoading}
                  onClick={() => handleLogin(pin.join(""))}
                  className="w-full py-4 bg-primary-600 text-white rounded-2xl font-bold shadow-xl shadow-primary-100 
                  hover:bg-primary-700 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:shadow-none disabled:scale-100
                  flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="size-5 animate-spin" />
                  ) : (
                    "Acceder"
                  )}
                </button>

                <button
                  onClick={onClose}
                  className="w-full py-2 text-zinc-400 font-semibold text-sm hover:text-zinc-600 transition-colors"
                >
                  Cancelar
                </button>

                <p className="text-[10px] text-zinc-400 font-medium mt-1">
                  Usa la clave de prueba: <span className="font-bold text-primary-600">123456</span>
                </p>
              </div>
            </div>
          </motion.article>
        </>
      )}
    </AnimatePresence>
  );
}
