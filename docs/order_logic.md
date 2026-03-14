# Documentación de la Lógica de Encargos

Esta sección detalla cómo funciona el flujo de creación de encargos, desde que el usuario ingresa los datos hasta que se persisten en Supabase.

## 1. Hooks Principales

### `useOrderForm(sessionId: string | null)`
Este hook gestiona el **estado local** del formulario durante los 3 pasos:
*   **Datos del Cliente**: Nombre, teléfono, fecha y hora de entrega, descripción.
*   **Carrito**: Lista de productos elegidos (`CartItem[]`).
*   **Adelantos**: Lista de pagos realizados como anticipo (`Payment[]`).
*   **Lógica de Envío**: Expone la función `submitOrder` que:
    1. Prepara el payload usando `prepareOrderPayload(tasa)`.
    2. Llama a la mutación `createOrder` del hook `useOrders`.
    3. Resetea el formulario al finalizar con éxito.

### `useOrders(sessionId: string | null)`
Este hook centraliza la **comunicación con la base de datos** (Supabase) mediante `react-query`:
*   **Query `pendingOrders`**: Recupera los encargos con estado "pending" para el tablero.
*   **Mutation `createOrder`**: Realiza una transacción (en orden) para guardar toda la información relacionada.

---

## 2. Estructura de Datos (Payload)

Cuando se envía una orden, el objeto `orderData` tiene el siguiente formato:

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `customer_name` | `string` | Nombre del cliente |
| `customer_phone` | `string` | Teléfono de contacto |
| `delivery_date` | `string` | Fecha ISO de entrega |
| `description` | `string` | Notas adicionales |
| `total_amount_bs` | `number` | Total calculado en Bolívares |
| `total_amount_usd` | `number` | Total calculado en Dólares |
| `tasa_bcv` | `number` | Tasa utilizada en la transacción |
| `items` | `Array` | Lista de `{ id (product_id), quantity, price }` |
| `payments` | `Array` | Lista de pagos de adelanto añadidos |

---

## 3. Flujo en la Base de Datos

La función `createOrder` en `useOrders.ts` sigue estos pasos de forma secuencial:

### A. Tabla `orders`
Inserta la cabecera del pedido. Supabase genera un `id` (UUID) que se usa para vincular el resto de las tablas.

### B. Tabla `order_items`
Mapea los productos del carrito e inserta una fila por cada uno vinculada al `order_id`. Se guarda el precio actual (`price_at_moment`).

### C. Registro de Anticipo (Si existen pagos)
Si la lista de `payments` no está vacía:
1.  **Tabla `sales`**: Se crea una "Venta de Adelanto" con `is_order_advance: true`. Esto permite que el dinero entre en la contabilidad de la sesión de caja actual. Se vincula al `order_id`.
2.  **Tabla `order_payments`**: Se registran los detalles de cada pago (método, monto, moneda) vinculados tanto a la `order_id` como a la `sale_id`.
3.  **Tabla `sale_payments`**: Se duplica el registro en esta tabla para que el POS reconozca el pago dentro del historial general de ventas.

---

## 4. Origen de los Datos

*   **Productos**: Provienen de `usePosData()`, que consulta la lista maestra de productos.
*   **Tasa**: Proviene de `useTasaBCV()`.
*   **Sesión**: El `activeSessionId` se obtiene de `useSessions()` y se encarga de que las ventas de adelanto se registren en el turno de caja correcto.
*   **Métodos de Pago**: Definidos en Supabase y recuperados por `usePosData()`.
