"use client";

import { useMemo } from "react";

interface OrderCalendarItem {
  delivery_date?: string;
  status: string;
  [key: string]: unknown;
}

interface DayOrders {
  date: string;
  orders: OrderCalendarItem[];
  count: number;
  byStatus: {
    pending: number;
    paid: number;
    delivered: number;
  };
}

export function useOrderCalendar(
  orders: OrderCalendarItem[] | undefined,
  currentMonth: Date,
) {
  const calendarData = useMemo(() => {
    if (!orders) return [];

    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dayMap: Record<string, DayOrders> = {};

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      dayMap[dateStr] = {
        date: dateStr,
        orders: [],
        count: 0,
        byStatus: { pending: 0, paid: 0, delivered: 0 },
      };
    }

    orders.forEach((order) => {
      const deliveryDate = order.delivery_date;
      if (deliveryDate && dayMap[deliveryDate]) {
        dayMap[deliveryDate].orders.push(order);
        dayMap[deliveryDate].count += 1;
        if (order.status === "pending") dayMap[deliveryDate].byStatus.pending += 1;
        if (order.status === "paid") dayMap[deliveryDate].byStatus.paid += 1;
        if (order.status === "delivered") dayMap[deliveryDate].byStatus.delivered += 1;
      }
    });

    return Object.values(dayMap);
  }, [orders, currentMonth]);

  return {
    calendarData,
    currentMonth,
  };
}