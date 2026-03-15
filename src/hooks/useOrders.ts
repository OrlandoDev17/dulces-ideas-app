/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export function useOrders(sessionId: string | null) {
  const queryClient = useQueryClient();

  const { data: activeOrders } = useQuery({
    queryKey: ["orders", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`*, order_items (*), order_payments (*)`)
        .in("status", ["pending", "paid", "delivered"])
        .eq("is_archived", false);
      if (error) throw error;
      return data;
    },
  });

  // --- MUTATION: Registrar pago parcial o total ---
  const completeOrderPayment = useMutation({
    mutationFn: async ({
      orderId,
      payments,
      tasa,
    }: {
      orderId: string;
      payments: any[];
      tasa: number;
    }) => {
      // 1. Crear nueva venta por el pago realizado
      const totalBs = payments.reduce((acc, p) => acc + (p.amount_bs || p.amountBs || 0), 0);
      const totalUsd = payments.reduce((acc, p) => acc + (p.amount_ref || p.amountRef || 0), 0);

      const { data: sale, error: saleError } = await supabase
        .from("sales")
        .insert([
          {
            session_id: sessionId,
            total_bs: totalBs,
            total_usd: totalUsd,
            tasa_bcv: tasa,
            is_archived: false,
            is_order_advance: true,
            order_id: orderId,
          },
        ])
        .select()
        .single();
      if (saleError) throw saleError;

      // 2. Registrar en order_payments
      const orderPaymentsInsert = payments.map((p) => ({
        order_id: orderId,
        sale_id: sale.id,
        method_id: p.method_id || p.methodId,
        amount_bs: p.amount_bs || p.amountBs,
        amount_ref: p.amount_ref || p.amountRef,
        currency: p.currency,
      }));
      const { error: opError } = await supabase.from("order_payments").insert(orderPaymentsInsert);
      if (opError) throw opError;

      // 3. Registrar en sale_payments (necesario para el historial de ventas)
      const salePaymentsInsert = payments.map((p) => ({
        sale_id: sale.id,
        method_id: p.method_id || p.methodId,
        amount_bs: p.amount_bs || p.amountBs,
        amount_ref: p.amount_ref || p.amountRef,
        currency: p.currency,
      }));
      const { error: spError } = await supabase.from("sale_payments").insert(salePaymentsInsert);
      if (spError) throw spError;

      // 4. Actualizar estado del pedido a 'paid'
      await supabase.from("orders").update({ status: "paid" }).eq("id", orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  // --- MUTATION: Marcar como entregado ---
  const deliverOrder = useMutation({
    mutationFn: async (orderId: string) => {
      await supabase.from("orders").update({ status: "delivered" }).eq("id", orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  // --- MUTATION: Eliminar pedido (borrado lógico) ---
  const deleteOrder = useMutation({
    mutationFn: async (orderId: string) => {
      await supabase
        .from("orders")
        .update({ is_archived: true, status: "cancelled" })
        .eq("id", orderId);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["orders"] }),
  });

  const createOrder = useMutation({
    mutationFn: async (orderData: any) => {
      // 1. Insertar Cabecera del Pedido
      const { data: order, error: orderError } = await supabase
        .from("orders")
        .insert([
          {
            session_id: sessionId,
            customer_name: orderData.customer_name,
            customer_phone: orderData.customer_phone,
            delivery_date: orderData.delivery_date,
            delivery_hour: orderData.delivery_hour,
            description: orderData.description,
            total_amount_bs: orderData.total_amount_bs,
            total_amount_usd: orderData.total_amount_usd,
            status: "pending",
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insertar Items
      const itemsToInsert = orderData.items.map((item: any) => ({
        order_id: order.id,
        product_id: parseInt(item.id), // Aseguramos que sea número
        quantity: item.quantity,
        price_at_moment: item.price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);
      if (itemsError) throw itemsError;

      // 3. REGISTRO DE PAGOS Y VENTA (SÓLO SI HAY PAGOS)
      if (orderData.payments && orderData.payments.length > 0) {
        const totalBs = orderData.payments.reduce(
          (acc: number, p: any) => acc + (p.amountBs || 0),
          0,
        );
        const totalUsd = orderData.payments.reduce(
          (acc: number, p: any) => acc + (p.amountRef || 0),
          0,
        );

        // A. Crear la Venta en 'sales'
        const { data: sale, error: saleError } = await supabase
          .from("sales")
          .insert([
            {
              session_id: sessionId,
              total_bs: totalBs,
              total_usd: totalUsd,
              tasa_bcv: orderData.tasa_bcv,
              is_order_advance: true,
              order_id: order.id,
              is_archived: false,
            },
          ])
          .select()
          .single();

        if (saleError) throw saleError;

        // B. Insertar en order_payments (Usando los nombres correctos que vienen del form)
        const orderPayments = orderData.payments.map((p: any) => ({
          order_id: order.id,
          sale_id: sale.id,
          method_id: p.methodId, // El form envía methodId
          amount_bs: p.amountBs,
          amount_ref: p.amountRef,
          currency: p.currency,
        }));

        const { error: opError } = await supabase
          .from("order_payments")
          .insert(orderPayments);
        if (opError) throw opError;

        // C. Insertar en sale_payments (Ojo: sale_payments NO lleva order_id habitualmente)
        const salePayments = orderData.payments.map((p: any) => ({
          sale_id: sale.id,
          method_id: p.methodId,
          amount_bs: p.amountBs,
          amount_ref: p.amountRef,
          currency: p.currency,
        }));

        const { error: spError } = await supabase
          .from("sale_payments")
          .insert(salePayments);
        if (spError) throw spError;
      }

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });

  return { createOrder, activeOrders, completeOrderPayment, deleteOrder, deliverOrder };
}
