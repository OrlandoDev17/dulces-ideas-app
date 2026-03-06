# Dulces Ideas App - Documentación Técnica

Esta es la documentación técnica principal para **Dulces Ideas App** (`@dulces-ideas/web`), un sistema de Punto de Venta (POS) y gestión construido con tecnologías web modernas.

## 🚀 Arquitectura y Stack Tecnológico

El proyecto está construido sobre React y Next.js, utilizando un enfoque fuertemente tipado con TypeScript y estilizado con Tailwind CSS.

### Tecnologías Core

- **Framework:** Next.js 16 (React 19)
- **Lenguaje:** TypeScript 5
- **Estilos:** Tailwind CSS v4
- **Animaciones:** Framer Motion (`motion`) para transiciones fluidas e interacciones UI.
- **Iconografía:** Lucide React

### Caching, Estado y Persistencia

- **Server State:** TanStack React Query v5. Utilizado para orquestar la obtención, caché y mutación de datos.
- **Persistencia Offshore/Offline:** `@tanstack/react-query-persist-client` en conjunto con `idb-keyval` (IndexedDB) para persistir la caché de React Query en el cliente, permitiendo un manejo resiliente de sesiones y ventas.
- **Estado Global:** React Context API para estados ui y reglas de negocio específicas que no requieren persistencia asíncrona (ej., `useMixedPayment`, `useSessions`).

### Backend y Servicios Externos

- **BaaS / Base de Datos:** Supabase (`@supabase/supabase-js`) para autenticación, base de datos en tiempo real y almacenamiento.
- **Automatización de Agentes:** Integración con flujos y agentes de **n8n** a través de hooks personalizados (`useN8n`), permitiendo acciones automatizadas e interfaces interactivas basadas en IA (ej., actualización de datos en tiempo real por el agente).

### Utilidades

- **Generación de Reportes:** `jspdf` y `jspdf-autotable` para exportar cierres de caja, reportes financieros y facturas en formato PDF directamente desde el cliente.
- **Peticiones HTTP:** `axios` y `fetch` estándar.

---

## 📂 Estructura del Proyecto

El código fuente principal reside en el directorio `src/`, organizado modularmente por responsabilidad:

```text
src/
├── api/          # Endpoints de API internas (Next.js Route Handlers)
├── app/          # Definición de rutas y vistas principales (Next.js App Router)
├── components/   # Componentes UI de React
│   ├── ui/       # Componentes base y de bajo nivel (botones, inputs, modales)
│   ├── ventas/   # Componentes de dominio específico del POS (PaymentModal, ActiveSale)
│   └── ...
├── context/      # Proveedores de estado global (React Context Providers)
├── hooks/        # Custom hooks para encapsular lógica de negocio (useSessions, useN8n, useMixedPayment)
├── lib/          # Tipos, esquemas de validación, constantes y utilidades externas
└── services/     # Capa del cliente para comunicación con APIs externas / Supabase
```

---

## ⚙️ Características Técnicas Principales

### 1. Sistema de Punto de Venta (POS) Dinámico

El módulo de ventas (en `components/ventas`) está diseñado para optimizar el rendimiento y la rápida captura de productos. Soporta operaciones rápidas y un manejador complejo del carrito de compras.

### 2. Motor de Pagos Mixtos (`useMixedPayment`)

Un flujo robusto que permite concretar una única transacción combinando múltiples métodos de pago (efectivo, tarjeta, transferencias) e incluso diferentes divisas (Bs., USD).

- **Validación Matemática:** Gestión precisa de decimales y cálculos de cambio/vuelto evitando errores de precisión de punto flotante.
- **Manejo de Tolerancia:** Lógica estricta de validación de pago completo y tolerancias configurables (ej. diferencias mínimas por redondeo en diferentes monedas).

### 3. Persistencia Asíncrona (Offline Support)

Se hace un fuerte énfasis en la experiencia del usuario intermitente implementando `idb-keyval`. Las ventas pendientes y las sesiones del usuario se mantienen vivas en IndexedDB, asegurando cero pérdida de estados críticos ante un reload de ventana.

### 4. Gestión Avanzada de Delivery

El sistema ha sido mejorado para un rastreo preciso de entregas a domicilio, tratándolas como una entidad financiera separada:

- **Contabilidad Independiente:** Los montos de delivery se descuentan automáticamente de los ingresos brutos en el panel financiero (`FinancialSummary`), gestionándolos como "Cuentas por Pagar".
- **Visualización Premium:** Diseño de indicadores visuales con iconos dinámicos y estados de entrega claros, agrupados por repartidor.
- **Sincronización PDF:** El servicio de exportación (`pdfService`) mantiene esta misma lógica, separando los ingresos operativos de las deudas por servicio de entrega.

### 5. Sistema de Interacción Visual (Modales Premium)

Se implementó un set de componentes de interacción robustos basados en **Framer Motion**:

- **ArchiveDayModal:** Proporciona un resumen ejecutivo del cierre del día con micro-gráficas animadas de distribución por método de pago.
- **ConfirmDeleteModal:** Un sistema estandarizado para acciones destructivas que reemplaza los diálogos nativos del navegador por una interfaz coherente y segura.
- **SuccessModal:** Un modal de retroalimentación positiva con cierre automático (barra de progreso de 2s), optimizado para confirmar la persistencia de datos en Supabase.

### 6. Event-Driven AI Actions (n8n Integration)

La aplicación puede suscribirse a respuestas provenientes de un webhook/agente en n8n. Mediante eventos despachados al `window` o integraciones en los hooks, las acciones exitosas de IA (ej., actualización procesada por un LLM) gatillan la invalidación de la caché de React Query (`refresh_worklyst_data`), provocando que la UI se renderice con datos frescos automáticamente.

---

## 🛠️ Convenciones de Desarrollo

- **Componentización:** Se prefieren componentes puros para la presentación y contenedores inteligentes (o custom hooks combinados con Context) para inyectar lógica compleja o interactuar con React Query.
- **Separación de Lógica de UI (Hooks):** Toda la lógica de negocio pesada, como cálculos de impuestos y consolidación en métodos de pagos mixtos, es delegada a _Custom Hooks_ (ej., `src/hooks/useMixedPayment.ts`).
- **Data Fetching:** Se utiliza estrictamente React Query para datos provenientes del backend. Múltiples queries comparten keys estandarizadas para invalidación optimista tras realizar mutaciones (Creación de ventas, modificaciones, etc.).
- **Optimización del Bundle:** Se emplean prácticas de Vercel/Next.js (`next/dynamic` importes) para la renderización de componentes pesados (como los modales transaccionales y gráficos).
