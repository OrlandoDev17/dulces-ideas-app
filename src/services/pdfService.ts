import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Sale, Cierre } from "../lib/types";
import { formatVenezuelaDate } from "./FechaYHora";

/**
 * Exporta el reporte de cierre de caja en formato PDF con el diseño solicitado.
 * Incluye ventas detalladas y cierres registrados.
 * @param sales Lista de ventas del día
 * @param cierres Lista de cierres de caja registrados
 */
export const exportSalesToPDF = (sales: Sale[], cierres: Cierre[] = []) => {
  const doc = new jsPDF();
  const now = new Date();
  const fechaHoy = formatVenezuelaDate(now);
  const horaActual = now.toLocaleTimeString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  // Configuración de Colores (Marrón solicitado)
  const PRIMARY_BROWN: [number, number, number] = [139, 109, 97]; // #8B6D61

  // --- CABECERA ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text("Reporte de Cierre de Caja", 14, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(
    `Fecha: ${fechaHoy.split(",")[1]?.trim() || fechaHoy} - Hora: ${horaActual}`,
    14,
    33,
  );

  // --- CÁLCULOS FINANCIEROS ---
  let pmBs = 0;
  let pvBs = 0;
  let efBs = 0;
  let usdTotal = 0;
  let deliveryTotal = 0;

  sales.forEach((sale) => {
    const payments = sale.sale_payments || [];
    const totalBs = sale.total_bs || sale.totalBs || 0;
    const totalUsd = sale.total_usd || sale.totalUsd || 0;
    const deliveryAmt = sale.delivery_amount || sale.deliveryAmount || 0;
    const tasa = sale.tasa_bcv || 1;

    // Ingresos (Descontando Delivery si aplica)
    if (payments.length > 0) {
      const totalPaidInBs = payments.reduce(
        (acc, p) => acc + (p.amount_bs || p.amountBs || 0),
        0,
      );

      payments.forEach((p) => {
        const mId = p.method_id || p.methodId;
        const amtBs = p.amount_bs || p.amountBs || 0;
        const amtRef = p.amount_ref || p.amountRef || 0;

        let finalAmtBs = amtBs;
        let finalAmtRef = amtRef;

        if (deliveryAmt > 0 && totalPaidInBs > 0) {
          const factor = amtBs / totalPaidInBs;
          const discountBs = deliveryAmt * factor;
          finalAmtBs = Math.max(0, amtBs - discountBs);
          finalAmtRef = Math.max(0, amtRef - discountBs / tasa);
        }

        if (mId === "pm") pmBs += finalAmtBs;
        if (mId === "punto" || mId === "pv") pvBs += finalAmtBs;
        if (mId === "ves" || mId === "bs") efBs += finalAmtBs;
        if (mId === "usd") usdTotal += finalAmtRef;
      });
    } else {
      const met = sale.method_id || sale.metodo;
      const finalTotalBs = Math.max(0, totalBs - deliveryAmt);
      const finalTotalUsd = Math.max(0, totalUsd - deliveryAmt / tasa);

      if (met === "pm") pmBs += finalTotalBs;
      if (met === "punto" || met === "pv") pvBs += finalTotalBs;
      if (met === "ves" || met === "bs") efBs += finalTotalBs;
      if (met === "usd") usdTotal += finalTotalUsd;
    }

    if (sale.delivery) {
      deliveryTotal += deliveryAmt;
    }
  });

  const totalBolivares = pmBs + pvBs + efBs;

  // --- TABLA DE RESUMEN FINANCIERO ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text("Resumen de Ingresos y Deudas", 14, 48);

  autoTable(doc, {
    startY: 53,
    head: [["Concepto", "Monto"]],
    body: [
      [
        "Ventas Bs (Pago Móvil)",
        `Bs. ${pmBs.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`,
      ],
      [
        "Ventas Bs (Punto)",
        `Bs. ${pvBs.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`,
      ],
      [
        "Ventas Bs (Efectivo)",
        `Bs. ${efBs.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`,
      ],
      [
        "Total Ingresos Bolívares",
        `Bs. ${totalBolivares.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`,
      ],
      ["Total Crédito Divisas ($)", `$${usdTotal.toFixed(2)}`],
      [
        "Deudas Delivery (A pagar)",
        `Bs. ${deliveryTotal.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`,
      ],
    ],
    theme: "grid",
    headStyles: { fillColor: PRIMARY_BROWN, textColor: [255, 255, 255] },
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 80 },
      1: { halign: "right" },
    },
    margin: { left: 14, right: 14 },
  });

  // --- TABLA DE CIERRES REGISTRADOS ---
  let currentY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY + 15;

  if (cierres.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text("Cierres de Caja Registrados", 14, currentY);

    const cierreRows = cierres.map((c) => [
      new Date(c.fecha).toLocaleTimeString("es-VE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      `Bs. ${c.monto.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`,
    ]);

    autoTable(doc, {
      startY: currentY + 5,
      head: [["Hora", "Monto Registrado"]],
      body: cierreRows,
      theme: "grid",
      headStyles: { fillColor: [80, 80, 80], textColor: [250, 250, 250] },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: { 1: { halign: "right", fontStyle: "bold" } },
      margin: { left: 14, right: 14 },
    });

    currentY =
      (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
        .finalY + 15;
  }

  // --- DETALLE DE VENTAS ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text("Detalle Cronológico de Ventas", 14, currentY);

  const tableRows = sales.map((sale) => {
    const saleItems = sale.sale_items || sale.items || [];
    const salePayments = sale.sale_payments || sale.payments || [];
    const totalBsNoDelivery =
      (sale.total_bs || sale.totalBs || 0) -
      (sale.delivery ? sale.delivery_amount || 0 : 0);

    return [
      new Date(sale.created_at || sale.fecha || "").toLocaleTimeString(
        "es-VE",
        {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        },
      ),
      saleItems.map((i) => `${i.quantity}x ${i.name || "Prod."}`).join(", "),
      salePayments.length > 1
        ? "Mixto"
        : salePayments[0]?.method_id === "pm" || sale.metodo === "pm"
          ? "P. Móvil"
          : salePayments[0]?.method_id === "punto" || sale.metodo === "punto"
            ? "Punto"
            : salePayments[0]?.currency === "USD" || sale.metodo === "usd"
              ? "Divisas"
              : "Efectivo",
      `Bs. ${totalBsNoDelivery.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`,
      sale.delivery
        ? `${sale.delivery_name || "Repart."} (+${sale.delivery_amount || 0})`
        : "-",
    ];
  });

  autoTable(doc, {
    startY: currentY + 5,
    head: [["Hora", "Items", "Método", "Monto", "Delivery"]],
    body: tableRows,
    theme: "grid",
    headStyles: { fillColor: PRIMARY_BROWN, textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [250, 250, 250] },
    styles: { fontSize: 8, cellPadding: 3 },
    columnStyles: { 3: { halign: "right" } },
    margin: { left: 14, right: 14 },
  });

  doc.save(`Cierre_Caja_${now.toISOString().split("T")[0]}.pdf`);
};
