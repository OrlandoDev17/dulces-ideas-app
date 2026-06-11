# design.md - Diseño y Arquitectura Dulces Ideas

## Paleta de Colores

### Primario (Marrón Dulces Ideas)
- **Primary-50**: `#fdf8f6` (fondos suaves)
- **Primary-100**: `#f8ebe6` (bordes, hover)
- **Primary-200**: `#f0d4c8` (elementos secundarios)
- **Primary-300**: `#c9a898` (texto secundario, labels)
- **Primary-500**: `#8B6D61` (elementos interactivos)
- **Primary-600**: `#7a5d51` (hover principal, botones)
- **Primary-800**: `#5a3d31` (textos principales)
- **Primary-900**: `#3d2a21` (textos oscuros)

### Secundario
- **Zinc**: Escala completa para fondos, bordes, textos neutros
- **White**: `#ffffff` (fondos de cards, sidebar)
- **Dark**: `#18181b` (texto principal)

### Estados
- **Success**: Verde para confirmaciones
- **Warning**: Amarillo para advertencias
- **Error/Danger**: Rojo para eliminaciones

### PDFs
- Color primario: `[139, 109, 97]` (#8B6D61)
- Color secundario: `[80, 80, 80]` (gris oscuro)

## Tipografía

- **Font Family**: Montserrat (Google Fonts via `next/font`)
- **Weights**: Regular (400), Medium (500), SemiBold (600), Bold (700), Black (900)
- **Headings**: Bold/Black, tracking-tight
- **Body**: Regular/Medium
- **Labels**: Uppercase, letter-spacing widen, text-xs

## Layout y Responsividad

### Breakpoints
- **Mobile**: < 768px (default)
- **Tablet (md)**: ≥ 768px
- **Desktop (lg)**: ≥ 1024px
- **Wide (xl)**: ≥ 1280px
- **Extra Wide (2xl)**: ≥ 1536px

### Estructura de Layout
```
┌─────────────────────────────────────────┐
│  Sidebar (desktop)  │    Main Content   │
│  - Logo + Store     │                   │
│  - Nav Links        │    {children}     │
│  - Session Selector │                   │
│  - Logout           │                   │
│  w-64/72            │    flex-1         │
│  fixed left         │    pl-64/72       │
└─────────────────────────────────────────┘

Mobile:
┌─────────────────────────────────────────┐
│            Main Content                 │
│              {children}                 │
│                                        │
├─────────────────────────────────────────┤
│  BottomNav (fixed bottom)               │
│  [Ventas] [Encargos] [Admin]            │
└─────────────────────────────────────────┘
```

### Sidebar
- **Fixed**: `left-0 top-0`, `min-h-screen`
- **Width**: `w-64` (xl: `w-72`)
- **Z-index**: 50
- **Background**: white con border-right `border-primary-500`
- **Solo visible en desktop**: `hidden md:flex`

### BottomNav
- **Fixed**: `bottom-0 left-0 right-0`
- **Solo visible en mobile**: `flex md:hidden`
- **Z-index**: 50

## Componentes Comunes

### Button
```tsx
// Variantes de estilo
type ButtonStyle = "primary" | "secondary" | "danger" | "dashed" | "ghost"

// Primary: bg-primary-600 text-white hover:bg-primary-700
// Secondary: bg-white text-primary-600 border-primary-200
// Danger: bg-red-500 text-white hover:bg-red-600
// Dashed: border-2 border-dashed border-zinc-300
// Ghost: transparent, hover:bg-zinc-100
```

### Modal
- **Overlay**: `fixed inset-0 bg-black/50 backdrop-blur-sm z-50`
- **Container**: `fixed inset-0 flex items-center justify-center p-4`
- **Content**: `bg-white rounded-2xl shadow-xl max-w-md w-full`
- **Animación**: Framer Motion scale + fade
- **Cierre**: Click overlay o botón X

### ConfirmActionModal
- Extiende Modal con icono, título, mensaje, botones de acción
- Tipos: `success` (verde), `warning` (amarillo), `danger` (rojo)
- Loading state con spinner

### Card
- **Background**: white
- **Border**: `border border-zinc-200/80`
- **Shadow**: `shadow-sm`
- **Border radius**: `rounded-2xl`
- **Padding**: `p-4 md:p-6`
- **Hover**: `hover:shadow-md transition-shadow`

### DropdownButton
- Botón que abre un dropdown
- Icono + texto + chevron
- Animación de apertura con Framer Motion

## Animaciones (Framer Motion)

### Variantes Disponibles
```typescript
// Contenedor stagger
staggerContainer: {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } }
}

// Fade up (elementos individuales)
fadeUp: {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: duration: 0.35 }
}

// Fade in (sin movimiento)
fadeIn: {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: duration: 0.3 }
}

// Slide in from left
slideInLeft: {
  hidden: { opacity: 0, x: -12 },
  visible: { opacity: 1, x: 0 }
}

// Slide in from right
slideInRight: {
  hidden: { opacity: 0, x: 12 },
  visible: { opacity: 1, x: 0 }
}
```

### Transición por Defecto
```typescript
transition: {
  duration: 0.35,
  ease: [0.25, 0.1, 0.25, 1] // cubic-bezier ease-out
}
```

### Uso en Páginas
```tsx
<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
>
  <motion.div variants={fadeUp}>Header</motion.div>
  <motion.div variants={fadeUp}>Contenido</motion.div>
</motion.div>
```

## Animación de Login
- **Overlay**: `bg-white/20 backdrop-blur-md` con z-index alto
- **Spinner**: Borde rotatorio con color primary
- **Logo**: Icono Cake con glow pulsante
- **Puntos**: 3 puntos con bounce escalonado
- **Background content**: `blur-2xl scale-105` cuando no autenticado

## Páginas

### POS (page.tsx)
```
┌─────────────────────────────────────────┐
│ Header: "Panel de Ventas" + Fecha       │
├─────────────────────────────────────────┤
│ BCVCard (tasa de cambio)                │
├─────────────────────────────────────────┤
│ Product Categories Grid (3 cols)        │
│ [Postres] [Tortas] [Bebidas]           │
├─────────────────────────────────────────┤
│ ActiveSale (carrito - aparece si hay    │
│ items) con TotalToPay y MixedPayment    │
├─────────────────────────────────────────┤
│ FinancialSummary (resumen del día)      │
├─────────────────────────────────────────┤
│ RecentSales (historial de ventas)       │
└─────────────────────────────────────────┘
```

### Orders (orders/page.tsx)
```
┌─────────────────────────────────────────┐
│ Header: "Panel de Encargos" + Botón     │
├─────────────────────────────────────────┤
│ Status Tabs: [Pendientes] [Pagadas]    │
│            [Entregadas]                 │
├─────────────────────────────────────────┤
│ Date Filter Badge (si hay filtro)       │
├───────────────────────┬─────────────────┤
│ Order Cards List      │ OrderCalendar   │
│ (flex-1)              │ (w-72, sticky)  │
│                       │                 │
└───────────────────────┴─────────────────┘
```

### Admin (admin/page.tsx)
```
┌─────────────────────────────────────────┐
│ Header: "Panel de Reportes" + Tabs      │
│ [7 días] [30 días] [Este Mes]           │
│ + Botón Exportar PDF                    │
├─────────────────────────────────────────┤
│ BentoGrid (layout de métricas)          │
│ ┌─────┐ ┌─────┐ ┌─────┐               │
│ │Sales│ │USD  │ │BS   │               │
│ └─────┘ └─────┘ └─────┘               │
│ ┌──────────────┐ ┌────────────┐        │
│ │  Chart       │ │Top Products│        │
│ └──────────────┘ └────────────┘        │
│ ┌──────────────┐ ┌────────────┐        │
│ │PaymentMethods│ │Orders Stats│        │
│ └──────────────┘ └────────────┘        │
└─────────────────────────────────────────┘
```

## Componentes POS

### ProductSelector
- Card con header (icono + título + contador)
- Grid de productos (2 columnas en mobile)
- Cada producto: nombre, precio, botón "+"
- Loading skeleton disponible

### ActiveSale
- Lista de items del carrito
- Toggle de delivery con nombre y monto
- Resumen de totales (subtotal, delivery, total)
- Botón "Registrar Venta" que abre MixedPaymentModal

### MixedPaymentModal
- Selección de método de pago
- Soporte para pago mixto (múltiples métodos)
- Formulario dinámico según método seleccionado
- Resumen de pagos parciales
- Botón confirmar con validación

### FinancialSummary
- 3 columnas: BS (ingresos), USD (crédito), Cierres
- Botón para agregar cierre de punto
- Lista de cierres registrados con opción de eliminar

### RecentSales
- Lista de ventas recientes
- Cada venta: hora, items, método, monto, delivery
- Acciones: editar, eliminar
- Botón "Limpiar Todo" y "Archivar Día"

## Componentes Orders

### OrderCard
- Card con datos del cliente y producto
- Badge de estado (pending/paid/delivered)
- Barra de progreso de pago
- Fecha de entrega
- Botones de acción: Pago, Entregar, Cancelar

### OrderCalendar
- Calendario visual con días marcados
- Indicador de encargos por día
- Selección de fecha para filtrar

### AddOrderModal
- Wizard de 3 pasos:
  1. Datos del cliente (nombre, teléfono, descripción)
  2. Selección de productos y cantidades
  3. Resumen y registro de pago inicial (opcional)

### OrderStepForm
- **Step1**: Campos de texto con iconos (User, Phone)
- **Step2**: Selector de productos con cantidades
- **Step3**: Resumen con totales y MixedPaymentModal

## Componentes Admin

### BentoGrid
- Layout CSS Grid responsivo
- Tarjetas de métricas principales
- Gráfico de línea (Tremor)
- Top productos
- Distribución de métodos de pago (pie chart)

### ReportCard
- Métrica con label, valor, y cambio porcentual
- Icono decorativo
- Animación de entrada

### BestSellers
- Lista ordenada de productos más vendidos
- Número de unidades vendidas

### PaymentMethodChart
- Gráfico de pie/donut con distribución
- Leyenda interactiva

## Servicios

### pdfService.ts
- **exportSalesToPDF**: Cierre de caja del día
  - Cabecera con fecha/hora de Venezuela
  - Tabla de resumen financiero (PM, PV, Efectivo, USD, Delivery)
  - Tabla de cierres registrados
  - Tabla detallada de ventas
  - Nombre de archivo: `Cierre_Caja_YYYY-MM-DD.pdf`

- **exportAdminReportToPDF**: Reporte de administración
  - Cabecera con tienda y período
  - Resumen de ventas
  - Distribución de métodos de pago
  - Estadísticas de encargos
  - Top productos vendidos
  - Nombre de archivo: `Reporte_Admin_RANGO_YYYY-MM-DD.pdf`

### FechaYHora.ts
- `getVenezuelaTime()`: Retorna Date en zona horaria `America/Caracas`
- `formatVenezuelaDate(date, time?)`: Formatea fecha en español venezolano

## Estado Global

### StoreContext
```typescript
interface StoreContextType {
  activeStore: Store | null;        // Tienda activa
  isLoading: boolean;               // Estado de carga
  loginToStore: (passcode) => Promise<{success, error?}>
  logoutFromStore: () => void;
}
```
- Persistido en `sessionStorage` como JSON

### SessionContext
```typescript
interface SessionContextType {
  currentSessionId: string | null;  // ID de sesión activa
  setCurrentSessionId: (id) => void;
  isLoading: boolean;
}
```
- Persistido en `localStorage` como string

## React Query Config

```typescript
// En RootLayout.tsx
new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 10,      // 10 min cache
      staleTime: 1000 * 30,         // 30 seg freshness
      refetchOnWindowFocus: true,   // Refrescar al volver
    },
  },
})
```

### Persister (IndexedDB)
- Usa `idb-keyval` para persistir cache de React Query
- Se crea con `createIDBPersister()`
- Persiste automáticamente entre sesiones del navegador

## CSS/Tailwind

### Configuración
- Tailwind v4 con `@import "tailwindcss"` en globals.css
- Sin archivo `tailwind.config.js` separado
- PostCSS con `@tailwindcss/postcss`

### Clases Comunes
```css
/* Fondo de página */
bg-zinc-50

/* Sidebar */
bg-white border-r-2 border-primary-500

/* Cards */
bg-white rounded-2xl border border-zinc-200/80 shadow-sm

/* Botones primary */
bg-primary-600 text-white hover:bg-primary-700

/* Texto principal */
text-primary-800 font-bold tracking-tight

/* Texto secundario */
text-primary-300 font-bold uppercase

/* Hover lift */
hover-lift (transform personalizado)

/* Transiciones */
transition-all duration-300
```

### Responsive Patterns
```tsx
// Mobile-first con override desktop
className="flex flex-col gap-4 md:gap-8"

// Grid responsivo
className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"

// Sidebar solo desktop
className="hidden md:flex"

// BottomNav solo mobile
className="flex md:hidden"

// Padding responsivo
className="p-2 md:p-6"
```
