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
    if (sale.payments && sale.payments.length > 0) {
      sale.payments.forEach((p) => {
        if (p.method === "pm") pmBs += p.amountBs;
        if (p.method === "pv") pvBs += p.amountBs;
        if (p.method === "bs") efBs += p.amountBs;
        if (p.method === "usd") usdTotal += p.amountRef;
      });
    } else {
      if (sale.metodo === "pm") pmBs += sale.totalBS;
      if (sale.metodo === "pv") pvBs += sale.totalBS;
      if (sale.metodo === "bs") efBs += sale.totalBS;
      if (sale.metodo === "usd") usdTotal += sale.totalUSD;
    }
    if (sale.deliveryAmount) deliveryTotal += sale.deliveryAmount;
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

  const tableRows = sales.map((sale) => [
    new Date(sale.fecha).toLocaleTimeString("es-VE", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }),
    sale.items.map((i) => `${i.quantity}x ${i.name}`).join(", "),
    sale.payments && sale.payments.length > 1
      ? "Mixto"
      : sale.metodo === "pm"
        ? "P. Móvil"
        : sale.metodo === "pv"
          ? "Punto"
          : sale.metodo === "usd"
            ? "Divisas"
            : "Efectivo",
    `Bs. ${sale.totalBS.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`,
    sale.delivery
      ? `${sale.deliveryName || "Repart."} (+${sale.deliveryAmount || 0})`
      : "-",
  ]);

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
