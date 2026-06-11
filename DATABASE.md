# DATABASE.md - Esquema de Base de Datos Dulces Ideas

## Tabla `products`

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `int4` | Primary |
| `name` | `text` |  |
| `price` | `numeric` |  |
| `category` | `text` |  Nullable |
| `is_active` | `bool` |  Nullable |
| `currency` | `text` |  Nullable |
| `store_id` | `uuid` |  Nullable |

## Tabla `payment_methods`

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `text` | Primary |
| `name` | `text` |  |
| `currency` | `text` |  |

## Tabla `sessions`

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  |
| `is_open` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `store_id` | `uuid` |  Nullable |

## Tabla `sales`

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `session_id` | `uuid` |  Nullable |
| `total_bs` | `numeric` |  |
| `total_usd` | `numeric` |  |
| `tasa_bcv` | `numeric` |  |
| `is_archived` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `delivery` | `bool` |  Nullable |
| `delivery_name` | `text` |  Nullable |
| `delivery_amount` | `numeric` |  Nullable |
| `is_order` | `bool` |  Nullable |
| `is_order_advance` | `bool` |  Nullable |
| `order_id` | `uuid` |  Nullable |
| `store_id` | `uuid` |  Nullable |

## Tabla `sale_items`

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `sale_id` | `uuid` |  Nullable |
| `product_id` | `text` |  |
| `price_at_moment` | `numeric` |  |
| `quantity` | `int4` |  |

## Tabla `sale_payments`

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `sale_id` | `uuid` |  Nullable |
| `method_id` | `text` |  |
| `amount_bs` | `numeric` |  |
| `amount_ref` | `numeric` |  |
| `currency` | `text` |  |

## Tabla `orders`

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `session_id` | `uuid` |  Nullable |
| `customer_name` | `text` |  |
| `customer_phone` | `text` |  Nullable |
| `delivery_date` | `timestamptz` |  |
| `status` | `text` |  Nullable |
| `total_amount_bs` | `numeric` |  |
| `total_amount_usd` | `numeric` |  |
| `description` | `text` |  Nullable |
| `created_at` | `timestamptz` |  Nullable |
| `is_archived` | `bool` |  Nullable |
| `delivery_hour` | `text` |  Nullable |
| `store_id` | `uuid` |  Nullable |

## Tabla `order_items`

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `order_id` | `uuid` |  Nullable |
| `product_id` | `int4` |  Nullable |
| `quantity` | `int4` |  |
| `price_at_moment` | `numeric` |  |

## Tabla `order_payments`

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `order_id` | `uuid` |  Nullable |
| `sale_id` | `uuid` |  Nullable |
| `method_id` | `text` |  |
| `amount_bs` | `numeric` |  |
| `amount_ref` | `numeric` |  |
| `currency` | `text` |  |
| `created_at` | `timestamptz` |  Nullable |

## Tabla `store`

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `name` | `text` |  Nullable |
| `passcode` | `text` |  |
| `is_demo` | `bool` |  Nullable |
| `created_at` | `timestamptz` |  |

## Tabla `point_closings`

| Name | Type | Constraints |
|------|------|-------------|
| `id` | `uuid` | Primary |
| `store_id` | `uuid` |  |
| `session_id` | `uuid` |  |
| `total_bs_point` | `numeric` |  |
| `created_at` | `timestamptz` |  Nullable |
| `is_archived` | `bool` |  Nullable |

---

## Relaciones

```
stores (1) ──→ (N) sessions
stores (1) ──→ (N) sales
stores (1) ──→ (N) orders
stores (1) ──→ (N) point_closings

sessions (1) ──→ (N) sales
sessions (1) ──→ (N) orders
sessions (1) ──→ (N) point_closings

sales (1) ──→ (N) sale_items
sales (1) ──→ (N) sale_payments

orders (1) ──→ (N) order_items
orders (1) ──→ (N) order_payments

sales (N) ──→ (1) orders (via order_id) - pagos de avances de encargos
```

## Índices Recomendados

```sql
-- Para queries frecuentes
CREATE INDEX idx_sales_session ON sales(session_id);
CREATE INDEX idx_sales_store ON sales(store_id);
CREATE INDEX idx_sales_archived ON sales(is_archived);
CREATE INDEX idx_orders_session ON orders(session_id);
CREATE INDEX idx_orders_store ON orders(store_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_point_closings_session ON point_closings(session_id);
```
