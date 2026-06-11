# SPEC.md - Especificación del Proyecto Dulces Ideas

## Descripción General

**Dulces Ideas** es una aplicación web tipo PWA (Progressive Web App) diseñada para la gestión integral de un negocio de repostería/pastelería. Permite gestionar ventas en punto de venta (POS), encargos/pedidos de clientes, y generar reportes analíticos con exportación a PDF.

**Nombre del paquete**: `@dulces-ideas/web`
**Versión**: 0.1.0
**Privado**: Sí (no es un paquete npm público)

## Objetivos del Negocio

1. **Punto de Venta (POS)**: Registrar ventas rápidas de productos de pastelería
2. **Gestión de Encargos**: Administrar pedidos especiales con fechas de entrega
3. **Reportes**: Analizar ventas por períodos, métodos de pago, productos más vendidos
4. **Multi-tienda**: Soporte para múltiples tiendas con sistema de passcode
5. **Multi-sesión**: Múltiples sesiones de caja por tienda

## Módulos Principales

### 1. Punto de Venta (POS) - `/`

**Funcionalidades**:
- Selección de productos organizados por categorías (Postres, Tortas Completas, Bebidas)
- Carrito de compras con cantidades editables
- Registro de ventas con métodos de pago múltiples (pago mixto)
- Soporte para delivery con nombre de repartidor y monto adicional
- Tasa de cambio BCV en tiempo real para conversiones USD/VES
- Resumen financiero del día (ingresos BS, USD, cierres)
- Historial de ventas recientes con edición y eliminación
- Cierres de punto de venta (registros de cuadre de caja)
- Archivado de ventas al finalizar el día

**Flujo de venta**:
1. Cliente selecciona productos → se agrega al carrito
2. Selecciona método de pago (Pago Móvil, Efectivo, Punto, Divisas, Mixto)
3. Si es delivery: indica nombre y monto extra
4. Se registra la venta → se crea en Supabase con items y pagos
5. Se muestra confirmación y se limpia el carrito

### 2. Encargos - `/orders`

**Funcionalidades**:
- Crear nuevos encargos con datos del cliente (nombre, teléfono)
- Seleccionar productos con cantidades y precios
- Establecer fecha y hora de entrega
- Registrar pagos parciales o totales
- Estados del encargo: `pending` → `paid` → `delivered`
- Calendario visual de entregas
- Filtros por estado y fecha
- Eliminación en cascada (borra ventas, pagos, items asociados)

**Flujo de encargo**:
1. Crear encargo con datos del cliente
2. Agregar productos y precio total
3. Opcionalmente registrar pago inicial → se crea venta asociada
4. A medida que se pagan cuotas, se registran pagos
5. Cuando se marca como pagado (≥95% cobertura), cambia estado automáticamente
6. Al entregar, se marca como `delivered`

**Relación con ventas**:
- Cada pago de encargo crea una venta en `sales` con `is_order_advance: true`
- La venta tiene `order_id` que referencia al encargo
- Los pagos aparecen tanto en `sale_payments` como en `order_payments`

### 3. Admin/Reportes - `/admin`

**Funcionalidades**:
- Dashboard con métricas de ventas
- Períodos: Últimos 7 días, Últimos 30 días, Este Mes
- Gráficos de ingresos diarios (BS y USD)
- Top productos más vendidos
- Distribución de métodos de pago
- Estadísticas de encargos
- Comparación con período anterior (% cambio)
- Exportación de reporte completo a PDF

## Productos (Hardcodeados)

### Postres (14 items, precio USD 4-7)
- Red Velvet, Cheesecake, Beso de Angel, Chocoquesillo, Quesillo, Pie, 3 Leches, Marquesa de Chocolate, Selva Negra, Oreo, Brownie Sencillo, Brownie Decorado, Malteada, Waffle

### Tortas Completas (19 items, precio USD 15-58)
- Quesillo 1kg-2kg, Chocoquesillo 1kg-2kg, Selva Negra 1kg-2kg, Oreo 1kg-2kg, Pie 2kg, 3 Leches 1.5kg-3kg, Beso de Angel 2kg-4kg, Red Velvet 1kg-2kg, Cheesecake 2kg, Vainifresa 2kg

### Bebidas (5 items, precio USD 2.5-300 VES)
- Malta (300 VES), Refresco (300 VES), Agua Mineral ($2.5), Té ($2.5), Gatorade ($2.5)

## Métodos de Pago

| ID   | Label               | Moneda |
|------|---------------------|--------|
| `pm` | Bs - Pago Móvil     | VES    |
| `bs` | Bs - Efectivo       | VES    |
| `pv` | Bs - Punto de Venta | VES    |
| `usd`| USD - Divisas       | USD    |
| `mx` | Pago Mixto          | Mixto  |

## Modelos de Datos (TypeScript)

### Sale
```typescript
interface Sale {
  id: string;
  session_id: string | null;
  store_id?: string;
  total_bs: number;
  total_usd: number;
  tasa_bcv: number;
  delivery: boolean;
  delivery_name?: string | null;
  delivery_amount?: number | null;
  is_archived: boolean;
  is_order_advance?: boolean;
  order_id?: string;
  created_at?: string;
  sale_items?: CartItem[];
  sale_payments?: Payment[];
}
```

### Order
```typescript
interface Order {
  id: string;
  session_id?: string;
  store_id?: string;
  customer_name: string;
  customer_phone: string;
  description?: string;
  delivery_date: string;
  delivery_hour: string;
  total_amount_bs: number;
  total_amount_usd: number;
  status: "pending" | "paid" | "delivered";
  is_archived: boolean;
  order_items?: OrderItem[];
  order_payments?: OrderPayment[];
}
```

### Session
```typescript
interface Session {
  id?: string;
  name: string;
  is_open: boolean;
  created_at?: string;
}
```

### PointClosing
```typescript
interface PointClosing {
  id: string;
  store_id: string;
  session_id: string;
  total_bs_point: number;
  created_at: string;
  is_archived: boolean;
}
```

## Reglas de Negocio

### Monedas y Conversiones
- Todos los precios de productos están en USD excepto Malta y Refresco (VES)
- La tasa BCV se obtiene en tiempo real y se usa para conversiones
- El resumen financiero muestra BS y USD por separado
- Los PDFs muestran montos en ambas monedas

### Delivery
- El monto de delivery se suma al total de la venta
- En el cierre de caja, el monto de delivery se resta de los ingresos
- Se registra nombre del repartidor y monto adicional

### Cierres de Punto de Venta
- Se registran montos de cuadre de caja (punto de venta físico)
- Se archivan junto con las ventas al finalizar el día
- Aparecen en el resumen financiero

### Estados de Encargo
- `pending`: Creado, sin pagar o con pago parcial
- `paid`: Pagado ≥95% (auto-cambia al superar el umbral)
- `delivered`: Entregado físicamente al cliente

### Archivado
- Las ventas se archivan (`is_archived: true`) al finalizar el día
- Las ventas archivadas NO aparecen en el POS pero SÍ en analytics
- Los cierres también se archivan
- Los encargos NO se archivan, se eliminan permanentemente

## Autenticación y Multi-tenancy

- Login por passcode de tienda (ej: "1234")
- La tienda activa se guarda en `sessionStorage`
- Todas las queries filtran por `store_id`
- Las sesiones de caja pertenecen a una tienda específica

## Variables de Entorno Requeridas

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxxxxxx
```

## Dependencias Principales

| Paquete | Uso |
|---------|-----|
| next@16.1.6 | Framework React |
| react@19.2.3 | UI Library |
| @supabase/supabase-js | Backend/DB |
| @tanstack/react-query | Server state |
| @tremor/react | Gráficos |
| motion | Animaciones |
| jspdf + jspdf-autotable | Generación PDF |
| lucide-react | Iconos |
| date-fns | Manipulación de fechas |
| react-datepicker | Selector de fechas |
| idb-keyval | Persistencia IndexedDB |
