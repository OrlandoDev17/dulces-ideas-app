import { useState } from "react";
import { Cake, Phone, User, X, Calendar, Clock } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { OrderInput } from "./OrderInput";
import { OrderSelect } from "./OrderSelect";
import { OrderDatePicker } from "./OrderDatePicker";

interface AddOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AddOrderModal({ isOpen, onClose }: AddOrderModalProps) {
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [deliveryTime, setDeliveryTime] = useState("");

  const TIME_SLOTS: string[] = [];
  for (let hour = 10; hour <= 21; hour++) {
    for (let min = 0; min < 60; min += 30) {
      if (hour === 21 && min > 0) continue;
      const hour12 = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
      const ampm = hour >= 12 ? "pm" : "am";
      const minStr = min === 0 ? "00" : "30";
      TIME_SLOTS.push(`${hour12}:${minStr} ${ampm}`);
    }
  }

  const CLIENT_DETAILS = [
    {
      name: "name",
      label: "Nombre del cliente",
      type: "text",
      value: "",
      onChange: () => {},
      icon: User,
      placeholder: "Ej. Jhon Doe",
    },
    {
      name: "phone",
      label: "Teléfono del cliente",
      type: "text",
      value: "",
      onChange: () => {},
      icon: Phone,
      placeholder: "Ej. 0412-1234567",
    },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-900 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          />

          {/* Modal */}
          <motion.article
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:max-w-md bg-white 
            rounded-xl shadow-2xl z-901 overflow-visible border border-zinc-100 flex flex-col max-h-[90vh]"
          >
            <header className="flex items-center justify-between p-4 border-b border-primary-400 mb-4">
              <div className="flex items-center gap-2 text-primary-600">
                <Cake className="size-7" />
                <h2 className="text-xl font-bold">Nuevo Encargo</h2>
              </div>
              <X
                onClick={onClose}
                className="size-11 p-2 rounded-full text-primary-700 hover:bg-black/20 cursor-pointer transition-all"
              />
            </header>
            <div className="flex flex-col gap-6 px-4 pb-4">
              <section className="flex flex-col gap-8">
                <header className="flex flex-col gap-1">
                  <h3 className="text-xl text-primary-700 font-bold">
                    Nuevo Encargo - Paso 1 de 2
                  </h3>
                  <h4 className="text-sm text-primary-400">
                    Detalles del cliente y entrega
                  </h4>
                </header>
                <div>
                  <form className="flex flex-col gap-2">
                    {CLIENT_DETAILS.map((field) => (
                      <OrderInput key={field.name} {...field} />
                    ))}
                    <div className="grid md:grid-cols-2 gap-4 mt-4">
                      <OrderDatePicker
                        label="Fecha de entrega"
                        selected={deliveryDate}
                        onChange={(date) => setDeliveryDate(date)}
                        icon={Calendar}
                        placeholder="dd/mm/aaaa"
                      />
                      <OrderSelect
                        label="Hora de entrega"
                        value={deliveryTime}
                        onSelect={setDeliveryTime}
                        options={TIME_SLOTS}
                        getLabel={(op) => op}
                        icon={Clock}
                        placeholder="Ej. 02:00 pm"
                      />
                    </div>
                  </form>
                </div>
              </section>
            </div>
          </motion.article>
        </>
      )}
    </AnimatePresence>
  );
}
