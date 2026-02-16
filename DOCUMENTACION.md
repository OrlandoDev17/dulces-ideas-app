# Documentación Técnica - Dulces Ideas App 🍪

Esta documentación detalla la arquitectura, estructura y funcionamiento de los módulos del sistema de ventas.

## 🏗️ Estructura de Carpetas (`/apps/web/src`)

```text
src/
├── app/                # Enrutamiento y páginas principales (Next.js App Router)
├── components/         # Componentes de la interfaz de usuario
│   ├── common/         # Componentes reutilizables (Botones, Dropdowns, etc.)
│   └── ventas/         # Componentes específicos del módulo de ventas
│       ├── mixed-payment/  # Sub-módulo para pagos múltiples
│       └── recent-sales/   # Sub-módulo para historial y reportes
├── hooks/              # Lógica de estado y efectos reutilizables
├── lib/                # Utilidades, tipos y constantes globales
└── services/           # Servicios externos y lógica de negocio (PDF, Fechas)
```

---

## 💻 Páginas (`/app`)

### `page.tsx` (Panel de Ventas)

Es el orquestador principal. Gestiona el estado global de:

- **Carrito**: Productos seleccionados actualmente.
- **Ventas**: Historial cargado desde `localStorage`.
- **Cierres**: Registros manuales de fin de caja.
- **Tasa**: Valor actual del dólar (BCV).

---

## 🧩 Componentes Críticos (`/components/ventas`)

### 1. `FinancialSummary.tsx`

Muestra el resumen financiero en tiempo real.

- **Ingresos**: Desglose por método (Pago Móvil, Punto, Efectivo) en Bolívares y Divisas.
- **Cuentas x Pagar**: Listado automático de deudas de Delivery.
- **Cierres**: Historial visual de los cierres realizados en el día.

### 2. `ActiveSale.tsx`

Gestiona la venta en curso. Permite:

- Ver items en el carrito.
- Seleccionar método de pago (Simple o Mixto).
- Marcar como delivery y asignar repartidor.
- Registrar la venta definitiva.

### 3. `MixedPaymentModal.tsx`

Modal complejo para segmentar un pago en múltiples partes.

- **Sub-componentes**: `PaymentForm`, `PaymentList`, `PaymentSummary`.
- **Lógica**: Calcula montos restantes en Bs y $ simultáneamente.

### 4. `RecentSales.tsx`

Sección de historial dividida en:

- `RecentSalesHeader`: Acciones de exportación PDF y limpieza.
- `RecentSalesTable`: Listado con soporte para **edición de precios** inline y eliminación.

---

## ⚓ Hooks Personalizados (`/hooks`)

| Hook                 | Responsabilidad                                         |
| :------------------- | :------------------------------------------------------ |
| `useTasaBCV`         | Fetching y sincronización de la tasa del dólar oficial. |
| `useMixedPayment`    | Cálculos de balance y validación de pagos múltiples.    |
| `useRecentSalesEdit` | Maneja el estado de edición (inputs) de ventas pasadas. |

---

## 🛠️ Servicios (`/services`)

### `pdfService.ts`

Genera el **Reporte de Cierre de Caja** profesional usando `jsPDF`.

- Diseña tablas automáticas con colores corporativos (Marrón `#8B6D61`).
- Agrupa deudas de delivery y cierres manuales.

### `FechaYHora.ts`

Normaliza el manejo de zonas horarias para asegurar que los reportes siempre usen la hora de **Venezuela (UTC-4)**.

---

## 🔧 Tipos Globales (`/lib/types.ts`)

- `Sale`: Representa una transacción completa.
- `Cierre`: Registro manual de monto recolectado.
- `Payment`: Desglose de un pago individual (usado en pagos mixtos).
