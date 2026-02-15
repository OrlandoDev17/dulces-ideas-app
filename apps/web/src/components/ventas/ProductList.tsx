import { CartItem } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

interface Props {
  items: CartItem[];
  onRemoveItem: (id: string) => void;
}

export function ProductList({ items, onRemoveItem }: Props) {
  return (
    <section className="flex flex-col gap-2 overflow-hidden">
      <ul className="flex flex-col gap-2">
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.li
              key={`cart-${item.id}-${index}`}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="flex justify-between items-center p-3 hover:bg-zinc-50 rounded-2xl transition-colors border border-transparent hover:border-zinc-100 group"
            >
              <div className="flex flex-col">
                <strong
                  className="font-bold text-zinc-800 text-sm leading-tight"
                  title={item.name}
                >
                  {item.name}
                </strong>
                <small className="text-sm text-zinc-500 font-medium italic">
                  {item.quantity} un. × ${item.price.toFixed(2)}
                </small>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold text-primary text-lg">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 text-zinc-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                  aria-label={`Eliminar ${item.name}`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>
    </section>
  );
}
