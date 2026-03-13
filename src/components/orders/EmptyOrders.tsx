import { CirclePlus, ShoppingBasket } from "lucide-react";
import { Button } from "@/components/common/Button";
import { motion } from "motion/react";
import {
  fadeUp,
  slideInLeft,
  slideInRight,
  staggerContainer,
} from "@/lib/animations";

export function EmptyOrders({ onClick }: { onClick: () => void }) {
  return (
    <motion.article
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center gap-6"
    >
      <motion.header
        variants={fadeUp}
        className="flex items-center justify-center"
      >
        <ShoppingBasket className="size-36 p-6 text-primary-600 bg-primary-100 rounded-lg" />
      </motion.header>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col gap-2 items-center"
      >
        <motion.h2 variants={slideInLeft} className="text-2xl font-black">
          No hay encargos registrados todavia
        </motion.h2>
        <motion.p
          variants={slideInRight}
          className="text-lg max-w-lg text-center text-primary-400"
        >
          Tu agenda de pedidos esta lista. Agrega tu primer encargo para
          comenzar
        </motion.p>
      </motion.div>
      <motion.footer variants={fadeUp}>
        <Button style="primary" onClick={onClick}>
          <CirclePlus />
          Agregar Encargo
        </Button>
      </motion.footer>
    </motion.article>
  );
}
