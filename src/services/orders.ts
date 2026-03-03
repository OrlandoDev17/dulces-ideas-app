import { Order, OrderPayment, Sale } from "@/lib/types";

const ORDERS_KEY = "orders";
const SALES_KEY = "sales";

export const ordersService = {
  /**
   * Obtiene todos los encargos desde localStorage
   */
  getOrders(): Order[] {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(ORDERS_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  /**
   * Guarda la lista completa de encargos
   */
  saveOrders(orders: Order[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  },

  /**
   * Agrega un nuevo encargo y registra la venta inicial si aplica
   */
  addOrder(order: Order, tasa: number) {
    const orders = this.getOrders();
    const updated = [...orders, order];
    this.saveOrders(updated);

    // Si el encargo tiene un pago inicial, lo registramos como venta
    if (order.pagos.length > 0) {
      const payment = order.pagos[0];
      this.registerSaleFromPayment(order, payment, "Pago inicial");
    }
  },

  /**
   * Actualiza el estado de un encargo
   */
  updateOrderStatus(id: string, status: Order["estado"]) {
    const orders = this.getOrders();
    const updated = orders.map((o) =>
      o.id === id ? { ...o, estado: status } : o,
    );
    this.saveOrders(updated);
  },

  /**
   * Registra un nuevo abono a un encargo ya existente
   */
  recordPayment(orderId: string, payment: OrderPayment) {
    const orders = this.getOrders();
    let updatedOrder: Order | null = null;

    const updatedOrders = orders.map((o) => {
      if (o.id === orderId) {
        const newPagos = [...o.pagos, payment];
        const totalPaid = newPagos.reduce((acc, p) => acc + p.amountRef, 0);

        let newStatus: Order["estado"] = o.estado;
        if (totalPaid >= o.totalUSD) {
          newStatus = "pagado";
        } else if (totalPaid > 0) {
          newStatus = "parcial";
        }

        updatedOrder = { ...o, pagos: newPagos, estado: newStatus };
        return updatedOrder;
      }
      return o;
    });

    this.saveOrders(updatedOrders);

    if (updatedOrder) {
      this.registerSaleFromPayment(updatedOrder, payment, "Abono");
    }
  },

  /**
   * Elimina un encargo
   */
  deleteOrder(id: string) {
    const orders = this.getOrders();
    const updated = orders.filter((o) => o.id !== id);
    this.saveOrders(updated);
  },

  /**
   * Registra una venta en el historial general basada en un pago de encargo
   * @private
   */
  registerSaleFromPayment(
    order: Order,
    payment: OrderPayment,
    concept: string,
  ) {
    if (typeof window === "undefined") return;

    const sale: Sale = {
      id: crypto.randomUUID(),
      items: [
        {
          id: crypto.randomUUID(),
          name: `${concept}: ${order.productoNombre} (${order.clienteNombre})`,
          price: order.totalUSD,
          quantity: 1,
          currency: "USD",
        },
      ],
      totalUSD: payment.amountRef,
      totalBS: payment.amountBs,
      metodo: payment.method,
      fecha: payment.fecha,
      delivery: false,
      type: "order_payment",
      description: `${concept} a encargo #${order.id.slice(0, 8)}`,
      orderId: order.id,
    };

    const storedSales = JSON.parse(localStorage.getItem(SALES_KEY) || "[]");
    localStorage.setItem(SALES_KEY, JSON.stringify([...storedSales, sale]));
  },
};
