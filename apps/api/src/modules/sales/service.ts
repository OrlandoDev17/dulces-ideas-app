import { prisma } from "../../config/prisma";

export const SalesService = {
  async registerFullSale(data: any) {
    return await prisma.sale.create({
      data: {
        sessionId: data.session_id,
        totalUsd: data.totalUSD,
        totalBs: data.totalBS,
        tasaBcv: data.tasa_bcv,
        items: {
          create: data.items.map((item: any) => ({
            productId: item.id,
            quantity: item.quantity,
            priceAtMoment: item.price,
          })),
        },
        payments: {
          create: data.payments.map((p: any) => ({
            methodId: p.method_id,
            amountBs: p.amountBs,
            amountRef: p.amountRef,
          })),
        },
      },
      include: {
        items: true,
        payments: true,
      },
    });
  },

  async getRecent(sessionId: string) {
    return await prisma.sale.findMany({
      where: { sessionId },
      orderBy: { createdAt: "desc" },
      include: {
        items: { include: { product: true } },
        payments: { include: { method: true } },
      },
    });
  },

  async getBalance(sessionId: string) {
    const payments = await prisma.salePayment.findMany({
      where: { sale: { sessionId } },
      include: { method: true },
    });

    const balance = payments.reduce((acc: any, curr) => {
      // Validación de seguridad para evitar el error de null
      const methodName = curr.method?.name || "Método Desconocido";
      const methodCurrency = curr.method?.currency || "N/A";

      if (!acc[methodName]) {
        acc[methodName] = {
          metodo: methodName,
          total_bs: 0,
          total_usd: 0,
          currency: methodCurrency,
        };
      }

      acc[methodName].total_bs += Number(curr.amountBs || 0);
      acc[methodName].total_usd += Number(curr.amountRef || 0);
      return acc;
    }, {});

    return Object.values(balance);
  },
};
