import { useState, useCallback } from "react";
import type { PaymentMethod } from "@/lib/types";
import axios from "axios";

export const usePaymentMethods = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  const fetchPaymentMethods = useCallback(async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/payment-methods`,
      );
      setPaymentMethods(response.data);
    } catch (error) {
      console.error("Error fetching payment methods:", error);
    }
  }, []);

  return { paymentMethods, fetchPaymentMethods };
};
