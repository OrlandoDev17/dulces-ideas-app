import { useState } from "react";
import { CartItem, Payment, PaymentMethod, Product } from "@/lib/types";
import { useOrders } from "./useOrders";

export function useOrderForm(sessionId: string | null) {
  const [step, setStep] = useState(1);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [deliveryDate, setDeliveryDate] = useState<Date | null>(null);
  const [deliveryTime, setDeliveryTime] = useState("");
  const [description, setDescription] = useState("");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  const { createOrder } = useOrders(sessionId);
  const isSubmitting = createOrder.isPending;

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => Math.max(1, s - 1));

  const addToCart = (product: Product, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find(
        (item) => item.product_id === String(product.id),
      );
      if (existing) {
        return prev.map((item) =>
          item.product_id === String(product.id)
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      }
      return [
        ...prev,
        {
          id: String(product.id) + "-" + Date.now(),
          name: product.name,
          price: product.price,
          quantity,
          currency: product.currency,
          product_id: String(product.id),
        },
      ];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const addPayment = (method: PaymentMethod, amount: number) => {
    const payment: Payment = {
      id: "pay_" + Date.now().toString(),
      methodId: method.id,
      currency: method.currency,
      amountBs: method.currency === "VES" ? amount : 0,
      amountRef: method.currency === "USD" ? amount : 0,
    };
    setPayments((prev) => [...prev, payment]);
  };

  const removePayment = (id: string) => {
    setPayments((prev) => prev.filter((p) => p.id !== id));
  };

  const prepareOrderPayload = (tasa: number) => {
    const totalUsd = cart.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0,
    );
    const totalBs = totalUsd * tasa;

    return {
      customer_name: customerName,
      customer_phone: customerPhone,
      delivery_date: deliveryDate?.toISOString() || new Date().toISOString(),
      delivery_hour: deliveryTime,
      description: description,
      items: cart.map((item) => ({
        id: item.product_id, // Este es el ID numérico de la tabla products
        quantity: item.quantity,
        price: item.price,
      })),
      total_amount_bs: totalBs,
      total_amount_usd: totalUsd,
      tasa_bcv: tasa,
      payments: payments, // Viene como [ { methodId, amountBs, ... } ]
    };
  };

  const submitOrder = async (tasa: number) => {
    try {
      const orderData = prepareOrderPayload(tasa);
      console.log("Submitting Order JSON:", orderData);
      await createOrder.mutateAsync(orderData);

      // Resetear Formulario
      setStep(1);
      setCart([]);
      setPayments([]);
      setCustomerName("");
      setCustomerPhone("");
      setDescription("");
      setDeliveryDate(null);
      setDeliveryTime("");

      return { success: true };
    } catch (error) {
      console.error("Error submitting order:", error);
      throw error;
    }
  };

  return {
    state: {
      step,
      customerName,
      customerPhone,
      description,
      deliveryDate,
      deliveryTime,
      cart,
      payments,
      isSubmitting,
    },
    actions: {
      setStep,
      nextStep,
      prevStep,
      setCustomerName,
      setCustomerPhone,
      setDescription,
      setDeliveryDate,
      setDeliveryTime,
      addToCart,
      removeFromCart,
      addPayment,
      removePayment,
      prepareOrderPayload,
      submitOrder,
    },
  };
}
