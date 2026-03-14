import { Calendar, Clock } from "lucide-react";
import { OrderInput } from "./OrderInput";
import { OrderSelect } from "./OrderSelect";
import { OrderDatePicker } from "./OrderDatePicker";
import { CLIENT_FORM_FIELDS, TIME_SLOTS } from "../../constants/orders";
import { motion } from "motion/react";

interface OrderStep1FormProps {
  deliveryDate: Date | null;
  setDeliveryDate: (date: Date | null) => void;
  deliveryTime: string;
  setDeliveryTime: (time: string) => void;
}

export function OrderStep1Form({
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
      <form className="flex flex-col gap-3">
        <div className="grid grid-cols-1 gap-3">
          {CLIENT_FORM_FIELDS.map((field) => (
            <OrderInput
              key={field.name}
              {...field}
              value=""
              onChange={() => {}}
            />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
    </motion.div>
  );
}
