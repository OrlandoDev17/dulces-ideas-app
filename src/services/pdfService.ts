import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Sale, PointClosing, Category, PaymentMethod } from "../shared/types";
import { formatVenezuelaDate, getVenezuelaTime } from "./FechaYHora";
import {
  summarizeSalesByMethod,
  isPagoMovilId,
} from "../shared/utils/paymentAggregation";
import { format } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Busca el nombre de un producto por su ID dentro de las categorías de productos.
 */
const getProductName = (
  id: string | number | undefined,
  productCategories: Category[],
): string => {
  if (!id || !productCategories?.length) return "Producto";
  const searchId = String(id);
  for (const cat of productCategories) {
    const found = cat.options.find((p) => String(p.id) === searchId);
    if (found) return found.name;
  }
  return `Producto`;
};

/**
 * Exporta el reporte de cierre de caja en formato PDF con el diseño solicitado.
 * Incluye ventas detalladas y cierres registrados.
 * @param sales Lista de ventas del día
 * @param cierres Lista de cierres de caja registrados
 * @param productCategories Lista de categorías con productos para resolver nombres
 */
export const exportSalesToPDF = (
  sales: Sale[],
  cierres: PointClosing[] = [],
  productCategories: Category[] = [],
  paymentMethods: PaymentMethod[] = [],
) => {
  const doc = new jsPDF();
  // Bug 1 Fix: usar hora de Venezuela (UTC-4) en vez de hora del servidor
  const now = getVenezuelaTime();
  const fechaHoy = formatVenezuelaDate(now);
  const horaActual = now.toLocaleTimeString("es-VE", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  // Fecha corta para el nombre del archivo (YYYY-MM-DD en Venezuela)
  const fechaArchivo = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

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
  // Fuente única de verdad compartida con el panel de ingresos diarios
  const summary = summarizeSalesByMethod(sales, paymentMethods);

  let deliveryTotal = 0;
  sales.forEach((sale) => {
    if (sale.delivery) {
      deliveryTotal += sale.delivery_amount || sale.deliveryAmount || 0;
    }
  });

  const fmtBs = (n: number) =>
    `Bs. ${n.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`;

  // --- TABLA DE RESUMEN FINANCIERO ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text("Resumen de Ingresos y Deudas", 14, 48);

  autoTable(doc, {
    startY: 53,
    head: [["Concepto", "Monto"]],
    body: [
      ...(summary.pmByAccount.length > 0
        ? summary.pmByAccount.map((account) => [
            account.accountId === "pm"
              ? "Ventas Bs (Pago Móvil)"
              : `Ventas Bs (Pago Móvil – ${account.label})`,
            fmtBs(account.amountBs),
          ])
        : [["Ventas Bs (Pago Móvil)", fmtBs(0)]]),
      ...(summary.pmByAccount.length > 1
        ? [["Total Pago Móvil", fmtBs(summary.pmTotal)]]
        : []),
      ["Ventas Bs (Punto)", fmtBs(summary.pvBs)],
      ["Ventas Bs (Efectivo)", fmtBs(summary.efBs)],
      ["Total Ingresos Bolívares", fmtBs(summary.totalBs)],
      ["Total Crédito Divisas ($)", `$${summary.usdTotal.toFixed(2)}`],
      ["Deudas Delivery (A pagar)", fmtBs(deliveryTotal)],
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
      new Date(c.created_at).toLocaleTimeString("es-VE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      `Bs. ${c.total_bs_point.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`,
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
      // Bug 2 Fix: resolver nombre del producto por product_id
      saleItems
        .map(
          (i) =>
            `${i.quantity}x ${getProductName(i.product_id || i.id, productCategories)}`,
        )
        .join(", "),
      salePayments.length > 1
        ? "Mixto"
        : isPagoMovilId(salePayments[0]?.method_id) ||
            isPagoMovilId(sale.metodo)
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

  doc.save(`Cierre_Caja_${fechaArchivo}.pdf`);
};

// =========================================================================
//  Reporte de Administración (Analytics)
// =========================================================================

interface AdminReportData {
  selectedOption: { label: string; value: string };
  dateRange: { start: Date; end: Date };
  totals: { bs: number; usd: number; count: number };
  totalsByCurrency: { bs: number; usd: number; bsEqUsd: number };
  topProducts: { id: string; units: number; revenue: number }[];
  productCategories: Category[];
  storeName: string;
}

export const exportAdminReportToPDF = ({
  selectedOption,
  dateRange,
  totals,
  totalsByCurrency,
  topProducts,
  productCategories,
  storeName,
}: AdminReportData) => {
  const doc = new jsPDF();
  const now = getVenezuelaTime();
  const fechaHoy = formatVenezuelaDate(now);
  const horaActual = now.toLocaleTimeString("es-VE", {
    hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true,
  });
  const fechaArchivo = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  const PRIMARY: [number, number, number] = [139, 109, 97];

  const fmtBs = (n: number) =>
    `Bs. ${n.toLocaleString("es-VE", { minimumFractionDigits: 2 })}`;
  const fmtUsd = (n: number) => `$${n.toFixed(2)}`;

  const dateRangeText = `${format(dateRange.start, "d MMM", { locale: es })} - ${format(dateRange.end, "d MMM yyyy", { locale: es })}`;
  const totalBsEq = totalsByCurrency.bs + totalsByCurrency.usd * (totalsByCurrency.bs / (totalsByCurrency.bsEqUsd || 1));

  // --- CABECERA ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(40, 40, 40);
  doc.text("Reporte de Administración", 14, 25);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`${storeName} — ${selectedOption.label}`, 14, 33);
  doc.text(`${dateRangeText} — ${fechaHoy} ${horaActual}`, 14, 40);

  // --- RESUMEN DE INGRESOS ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text("Resumen de Ingresos", 14, 52);

  autoTable(doc, {
    startY: 57,
    head: [["Concepto", "Monto"]],
    body: [
      ["Ventas Realizadas", `${totals.count} ventas`],
      ["Ingresos en Bolívares", fmtBs(totalsByCurrency.bs)],
      ["Ingresos en Divisas", fmtUsd(totalsByCurrency.usd)],
      ["Total Combinado (Bs)", fmtBs(totalBsEq)],
    ],
    theme: "grid",
    headStyles: { fillColor: PRIMARY, textColor: [255, 255, 255] },
    styles: { fontSize: 10, cellPadding: 4 },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 80 }, 1: { halign: "right" } },
    margin: { left: 14, right: 14 },
  });

  const currentY = (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable.finalY + 15;
  if (topProducts.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(60, 60, 60);
    doc.text("Productos Vendidos", 14, currentY);

    autoTable(doc, {
      startY: currentY + 5,
      head: [["#", "Producto", "Unidades", "Ingreso"]],
      body: topProducts.map((p, i) => [
        `${i + 1}`,
        getProductName(p.id, productCategories),
        `${p.units} u.`,
        p.revenue > 0 ? fmtUsd(p.revenue) : "-",
      ]),
      theme: "grid",
      headStyles: { fillColor: PRIMARY, textColor: [255, 255, 255] },
      styles: { fontSize: 10, cellPadding: 4 },
      columnStyles: {
        0: { halign: "center", cellWidth: 15 },
        1: { fontStyle: "bold" },
        2: { halign: "right" },
        3: { halign: "right" },
      },
      margin: { left: 14, right: 14 },
    });
  }

  doc.save(`Reporte_Admin_${selectedOption.value}_${fechaArchivo}.pdf`);
};
