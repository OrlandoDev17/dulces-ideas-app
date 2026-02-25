"use client";

import { Button } from "@/components/common/Button";
import { Cake, Plus } from "lucide-react";
import { useState } from "react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  return (
    <div className="flex flex-col gap-2 2xl:gap-4 py-4 px-4 2xl:px-8 mx-auto h-screen">
      <header className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl 2xl:text-3xl font-bold text-primary-800 tracking-tight">
            Encargos
          </h1>
          <p className="text-sm 2xl:text-base text-primary-300 font-bold uppercase">
            Gestión de pedidos próximos
          </p>
        </div>
        <Button style="primary">
          Nuevo Encargo <Plus />
        </Button>
      </header>
      {orders.length === 0 && (
        <section className="flex items-center justify-center h-full">
          <article className="flex flex-col gap-2 items-center justify-center p-4 border-2 border-dashed border-primary-600 rounded-2xl">
            <Plus />
            <p className="text-primary-300 text-xl font-bold uppercase tracking-wider">
              Agregar Encargo
            </p>
          </article>
        </section>
      )}
    </div>
  );
}
