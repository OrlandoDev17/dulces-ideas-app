import { useState, useCallback, useMemo } from "react";
import { Order, OrderPayment, OrderStatus } from "@/lib/types";
import { ordersService } from "@/services/orders";

/**
 * Hook personalizado para gestionar el estado de los encargos.
 * Sincroniza el estado local con el servicio de persistencia.
 */
export function useOrders() {
  const [orders, setOrders] = useState<Order[]>(() =>
    ordersService.getOrders(),
  );
  const [searchTerm, setSearchTerm] = useState("");

  const refreshOrders = useCallback(() => {
    setOrders(ordersService.getOrders());
  }, []);

  const addOrder = useCallback(
    (order: Order, tasa: number) => {
      ordersService.addOrder(order, tasa);
      refreshOrders();
    },
    [refreshOrders],
  );

  const removeOrder = useCallback(
    (id: string) => {
      if (confirm("¿Estás seguro de eliminar este encargo?")) {
        ordersService.deleteOrder(id);
        refreshOrders();
      }
    },
    [refreshOrders],
  );

  const updateStatus = useCallback(
    (id: string, status: OrderStatus) => {
      ordersService.updateOrderStatus(id, status);
      refreshOrders();
    },
    [refreshOrders],
  );

  const addPayment = useCallback(
    (orderId: string, payment: OrderPayment) => {
      ordersService.recordPayment(orderId, payment);
      refreshOrders();
    },
    [refreshOrders],
  );

  const filteredOrders = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return orders.filter(
      (o) =>
        o.clienteNombre.toLowerCase().includes(term) ||
        o.productoNombre.toLowerCase().includes(term),
    );
  }, [orders, searchTerm]);

  return {
    orders,
    filteredOrders,
    searchTerm,
    setSearchTerm,
    addOrder,
    removeOrder,
    updateStatus,
    addPayment,
  };
}
