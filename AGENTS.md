# AGENTS.md - Guía para Agentes de IA

## Comandos Disponibles

```bash
# Desarrollo
bun run dev          # Iniciar servidor de desarrollo Next.js
bun run build        # Build de producción
bun run start        # Iniciar servidor de producción
bun run lint         # Ejecutar ESLint

# No hay tests configurados en el proyecto actualmente
```

## Estructura del Proyecto

```
dulces-ideas-app/
├── src/
│   ├── app/                    # Next.js App Router (pages)
│   │   ├── layout.tsx          # Layout raíz (Montserrat font, metadata)
│   │   ├── page.tsx            # Página principal: Panel de Ventas (POS)
│   │   ├── globals.css         # Estilos globales Tailwind v4
│   │   ├── admin/page.tsx      # Panel de Reportes/Analytics
│   │   └── orders/page.tsx     # Panel de Encargos
│   │
│   ├── components/
│   │   ├── pos/                # Componentes del POS (punto de venta)
│   │   │   ├── active-sale/    # Carrito y registro de venta
│   │   │   ├── recent-sales/   # Ventas recientes, resumen financiero
│   │   │   └── mixed-payment/  # Modal de pago mixto
│   │   ├── orders/             # Componentes de encargos
│   │   │   └── add-orders/     # Formularios de creación de encargos
│   │   ├── admin/              # Componentes de reportes/analytics
│   │   ├── layout/             # Sidebar, BottomNav, LoginModal, RootLayout
│   │   └── common/             # Componentes reutilizables (Button, Modal, etc.)
│   │
│   ├── context/
│   │   ├── StoreContext.tsx     # Estado global de la tienda activa (login/logout)
│   │   └── SessionContext.tsx   # Sesión de caja activa
│   │
│   ├── hooks/
│   │   ├── api/                # Hooks para llamadas a Supabase
│   │   │   ├── useSales.ts     # CRUD de ventas
│   │   │   ├── useOrders.ts    # CRUD de encargos + pagos
│   │   │   ├── useSessions.ts  # Gestión de sesiones de caja
│   │   │   ├── useAnalytics.ts # Datos de reportes/admin
│   │   │   ├── usePosData.ts   # Productos y métodos de pago
│   │   │   └── usePointClosings.ts # Cierres de punto de venta
│   │   └── ui/                 # Hooks de UI y lógica de negocio
│   │       ├── useTasaBCV.ts   # Tasa de cambio BCV
│   │       ├── useCurrencyConverter.ts
│   │       ├── useMixedPayment.ts
│   │       └── useSaleTotals.ts
│   │
│   ├── api/                    # Capa de acceso a datos (Supabase)
│   │   ├── sales.ts            # CRUD ventas
│   │   ├── sessions.ts         # CRUD sesiones
│   │   ├── products.ts         # Productos y métodos de pago
│   │   ├── store.ts            # Validación de tienda
│   │   └── analytics.ts        # Queries de analytics
│   │
│   ├── services/
│   │   ├── pdfService.ts       # Generación de PDFs (cierre de caja, reportes admin)
│   │   └── FechaYHora.ts       # Utilidades de zona horaria Venezuela
│   │
│   ├── lib/
│   │   ├── Mock.ts             # Datos hardcodeados de productos
│   │   ├── Persister.ts        # Persistencia React Query con IndexedDB
│   │   └── animations.ts       # Variantes de Framer Motion
│   │
│   └── shared/
│       ├── types/index.ts      # TypeScript interfaces principales
│       └── config/
│           ├── supabase.ts     # Cliente Supabase
│           ├── constants.ts    # Links de nav, categorías, métodos de pago
│           └── orders.ts       # Configuración de formularios de encargos
```

## Convenciones de Código

### Stack Tecnológico
- **Framework**: Next.js 16 (App Router) con React 19
- **Language**: TypeScript estricto
- **Styling**: Tailwind CSS v4 (sin config separada, usa `@import "tailwindcss"` en globals.css)
- **State Management**: React Query (TanStack Query v5) para datos del servidor
- **Backend/DB**: Supabase (PostgreSQL)
- **Animaciones**: Framer Motion (paquete `motion`)
- **Gráficos**: Tremor (`@tremor/react`)
- **PDF**: jsPDF + jspdf-autotable
- **Icons**: Lucide React
- **Font**: Montserrat (Google Fonts via next/font)

### Convenciones de Archivos
- **Páginas**: `src/app/*/page.tsx` (siempre `"use client"`)
- **Componentes**: PascalCase, en carpetas por dominio
- **Hooks**: `use` prefix, carpetas `api/` y `ui/`
- **Interfaces**: Un archivo `shared/types/index.ts` centralizado
- **Config**: Carpeta `shared/config/`

### Patrones de Código
- Todos los componentes de página usan `"use client"` (SPA completa)
- Datos se obtienen con React Query + Supabase client-side
- Animaciones siempre con Framer Motion (variantes en `lib/animations.ts`)
- Modales con componente `Modal` o `ConfirmActionModal` reutilizable
- Fechas siempre en zona horaria de Venezuela (`America/Caracas`)
- Monedas: USD y VES (Bolívares), con tasa BCV para conversiones

### Estilo de Componentes
```tsx
// Patrón de componente de página
"use client";
import { motion } from "motion/react";
import { staggerContainer, fadeUp } from "@/lib/animations";

export default function PageName() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-4 w-full md:max-w-7xl md:mx-auto p-2 md:p-6"
    >
      <motion.div variants={fadeUp}>
        {/* contenido */}
      </motion.div>
    </motion.div>
  );
}
```

### Manejo de Estado
- **Servidor**: React Query para cache y sincronización
- **UI Local**: `useState` para modales, filtros, formularios
- **Global**: Context (`StoreContext`, `SessionContext`)
- **Persistencia**: React Query Persister con IndexedDB (idb-keyval)

### Autenticación
- Login por passcode de tienda (no usuario tradicional)
- Tienda se guarda en `sessionStorage`
- Sesión de caja se guarda en `localStorage`
- Modal de login aparece al no tener tienda activa

## Base de Datos (Supabase)

### Tablas Principales
- `sales` - Ventas registradas
- `sale_items` - Items de cada venta
- `sale_payments` - Pagos de cada venta
- `orders` - Encargos/pedidos
- `order_items` - Items de cada encargo
- `order_payments` - Pagos de cada encargo
- `sessions` - Sesiones de caja
- `stores` - Tiendas
- `point_closings` - Cierres de punto de venta

### Relaciones Clave
- `sales` → `sale_items` (1:N)
- `sales` → `sale_payments` (1:N)
- `orders` → `order_items` (1:N)
- `orders` → `order_payments` (1:N)
- `sales` → `orders` (N:1 via `order_id`) - ventas de avances de encargos
- Todas las tablas principales tienen `store_id` para multi-tenant

## Errores Comunes y Soluciones

1. **Variables de entorno**: Requiere `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`
2. **Fechas**: Siempre usar `getVenezuelaTime()` en vez de `new Date()` para mostrar fechas al usuario
3. **Productos**: Están hardcodeados en `lib/Mock.ts`, no en la base de datos
4. **Pagos mixtos**: Usar componente `MixedPaymentModal` existente
5. **Archivos legacy**: Algunos campos tienen doble nombre (ej: `totalBs` / `total_bs`) por compatibilidad

## Tips para Desarrollo

- La app es responsive: mobile-first con breakpoints `md:` y `lg:`
- El Sidebar es desktop-only, `BottomNav` es mobile-only
- Para agregar un nuevo método de pago, editar `PAYMENT_METHODS` en `constants.ts`
- Para agregar productos, editar arrays en `lib/Mock.ts`
- Los PDFs usan color marrón `#8B6D61` como primario
- El modal de login bloquea toda la UI hasta autenticarse
