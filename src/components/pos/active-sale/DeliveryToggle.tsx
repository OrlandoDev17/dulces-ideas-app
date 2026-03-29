import { MapPin } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface Props {
  setIsDelivery: (value: boolean) => void;
  isDelivery: boolean;
  DELIVERY_FIELDS: {
    id: string;
    label: string;
    icon: React.ElementType;
    placeholder: string;
    onChange: React.ChangeEventHandler<HTMLInputElement>;
    type: string;
    value: string | number;
  }[];
}

export function DeliveryToggle({
  setIsDelivery,
  isDelivery,
  DELIVERY_FIELDS,
}: Props) {
  return (
    <fieldset className="flex flex-col gap-3 border-none p-0 m-0">
      <button
        type="button"
        onClick={() => setIsDelivery(!isDelivery)}
        className={`w-full flex items-center justify-between border-2 rounded-xl px-4 py-3.5 text-sm font-black transition-all cursor-pointer ${
          isDelivery
            ? "bg-green-50 border-green-500 text-green-700 shadow-md shadow-green-100"
            : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200"
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`p-1.5 rounded-lg ${isDelivery ? "bg-green-500 text-white" : "bg-zinc-100 text-zinc-400"}`}
          >
            <MapPin size={16} />
          </div>
          ¿Es para Delivery?
        </div>
        <div
          className={`w-10 h-6 flex items-center rounded-full p-1 transition-colors ${isDelivery ? "bg-green-500" : "bg-zinc-200"}`}
        >
          <div
            className={`bg-white w-4 h-4 rounded-full shadow-sm transition-transform ${isDelivery ? "translate-x-4" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isDelivery && (
          <motion.div
            key="delivery-form"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 py-1">
              {DELIVERY_FIELDS.map(
                (
                  { id, label, icon: Icon, placeholder, onChange, type, value },
                  index,
                ) => (
                  <div key={`${id}-${index}`} className="flex flex-col gap-1.5">
                    <label
                      htmlFor={id}
                      className="text-[10px] font-black uppercase tracking-widest text-zinc-400 ml-1"
                    >
                      {label}
                    </label>
                    <div className="relative">
                      <Icon
                        size={16}
                        className="text-primary/60 absolute top-1/2 -translate-y-1/2 left-3"
                        aria-hidden="true"
                      />
                      <input
                        id={id}
                        type={type}
                        value={value}
                        onChange={onChange}
                        placeholder={placeholder}
                        spellCheck={false}
                        className={`w-full bg-zinc-50 border border-zinc-200 pl-10 pr-4 py-3 rounded-xl text-sm font-bold outline-none focus:ring-4 focus:ring-green-500/10 focus:border-green-500/50 transition-all ${type === "number" ? "font-mono tracking-wider tabular-nums" : ""}`}
                      />
                    </div>
                  </div>
                ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </fieldset>
  );
}
