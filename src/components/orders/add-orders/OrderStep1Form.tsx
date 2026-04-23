import { Calendar, Clock, User } from "lucide-react";
import { OrderInput } from "./OrderInput";
import { OrderDatePicker } from "./OrderDatePicker";
import { CLIENT_FORM_FIELDS } from "@/shared/config/orders";
import { motion } from "motion/react";

interface OrderStep1FormProps {
  customerName: string;
  setCustomerName: (name: string) => void;
  customerPhone: string;
  setCustomerPhone: (phone: string) => void;
  description: string;
  setDescription: (desc: string) => void;
  deliveryDate: Date | null;
  setDeliveryDate: (date: Date | null) => void;
  deliveryTime: string;
  setDeliveryTime: (time: string) => void;
}

export function OrderStep1Form({
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  description,
  setDescription,
  deliveryDate,
  setDeliveryDate,
  deliveryTime,
  setDeliveryTime,
}: OrderStep1FormProps) {

  return (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex flex-col gap-6">
        {/* Sección: Información del Cliente */}
        <section>
          <div className="flex items-center gap-2 mb-3 text-zinc-400">
            <User size={14} className="text-primary-500" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest">
              Datos del Cliente
            </h4>
          </div>
          <div className="flex flex-col gap-3">
            {CLIENT_FORM_FIELDS.map((field) => (
              <OrderInput
                key={field.name}
                {...field}
                value={
                  field.name === "name"
                    ? customerName
                    : field.name === "phone"
                      ? customerPhone
                      : description
                }
                onChange={(e) => {
                  if (field.name === "name") setCustomerName(e.target.value);
                  else if (field.name === "phone")
                    setCustomerPhone(e.target.value);
                  else setDescription(e.target.value);
                }}
              />
            ))}
          </div>
        </section>

        {/* Sección: Logística de Entrega */}
        <section className="bg-zinc-50/50 p-4 rounded-3xl border border-zinc-100 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-zinc-400">
            <Calendar size={14} className="text-primary-500" />
            <h4 className="text-[10px] font-bold uppercase tracking-widest">
              Logística de Entrega
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <OrderDatePicker
              label="Fecha"
              selected={deliveryDate}
              onChange={(date) => setDeliveryDate(date)}
              icon={Calendar}
              placeholder="Seleccionar fecha"
            />
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-primary-700 uppercase tracking-wide">
                Hora Aproximada
              </span>
              <div className="relative w-full">
                <input
                  type="text"
                  value={deliveryTime}
                  onChange={(e) => setDeliveryTime(e.target.value)}
                  placeholder="Ej. 2:30 pm"
                  className="w-full px-4 py-2 pl-10 pr-4 border border-primary-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white text-sm text-foreground"
                />
                <Clock className="size-5 text-gray-700 absolute top-1/2 -translate-y-1/2 left-3 pointer-events-none" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </motion.div>
  );
}
