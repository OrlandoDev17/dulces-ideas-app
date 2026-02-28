# 🍭 Dulces Ideas API Documentation

Esta documentación describe los endpoints disponibles en el backend de la aplicación **Dulces Ideas**, siguiendo los estándares sugeridos en la guía de `api-docs-generator`.

---

## 🚀 Información General

- **Nombre:** Dulces Ideas Backend
- **Versión:** 1.0.0
- **Base URL:** `http://localhost:3000/api` (Desarrollo)
- **Descripción:** API para la gestión de ventas, productos y sesiones de caja de la app Dulces Ideas.

---

## 📂 Endpoints

### 🛒 Catálogos (Frontend)

#### `GET /products`

**Resumen:** Listar productos agrupados por categoría.  
**Descripción:** Retorna el catálogo completo de productos activos organizado por categorías para facilitar la visualización en el frontend.

**Respuestas:**

- **200 OK:**
  ```json
  [
    {
      "label": "Donas",
      "options": [
        {
          "id": 1,
          "name": "Dona de Chocolate",
          "price": 2.5,
          "currency": "USD"
        }
      ]
    }
  ]
  ```

#### `GET /payment-methods`

**Resumen:** Obtener métodos de pago.  
**Descripción:** Retorna la lista de métodos de pago configurados (Efectivo, Zelle, Punto de Venta, etc.).

**Respuestas:**

- **200 OK:**
  ```json
  [
    {
      "id": 1,
      "name": "Efectivo USD",
      "currency": "USD"
    },
    {
      "id": 2,
      "name": "Punto de Venta",
      "currency": "VES"
    }
  ]
  ```

---

### 💰 Flujo de Ventas

#### `POST /sales`

**Resumen:** Registrar una nueva venta.  
**Descripción:** Procesa el registro de una venta completa, incluyendo los productos (items) y los pagos realizados.

**Cuerpo de la Petición:**

```json
{
  "session_id": "uuid-de-la-sesion",
  "totalUSD": 10.5,
  "totalBS": 404.25,
  "tasa_bcv": 38.5,
  "items": [{ "id": 1, "quantity": 2, "price": 2.5 }],
  "payments": [{ "method_id": 1, "amountBs": 0, "amountRef": 5.0 }]
}
```

**Respuestas:**

- **201 Created:** Venta registrada exitosamente.
- **500 Internal Error:** Error al procesar la venta.

#### `GET /sales/recent/:sessionId`

**Resumen:** Historial reciente de ventas.  
**Descripción:** Obtiene las últimas ventas realizadas en una sesión específica.

**Parámetros:**

- `sessionId` (path): UUID de la sesión/caja activa.

**Respuestas:**

- **200 OK:** Array de ventas con detalles de productos y pagos.

#### `GET /sales/balance/:sessionId`

**Resumen:** Balance de ingresos por método de pago.  
**Descripción:** Calcula el total recaudado en la sesión desglosado por cada método de pago.

**Parámetros:**

- `sessionId` (path): UUID de la sesión/caja activa.

**Respuestas:**

- **200 OK:**
  ```json
  [
    {
      "metodo": "Efectivo USD",
      "total_bs": 0,
      "total_usd": 150.0,
      "currency": "USD"
    },
    {
      "metodo": "Pago Móvil",
      "total_bs": 1250.5,
      "total_usd": 32.48,
      "currency": "VES"
    }
  ]
  ```

---

### 📦 Gestión de Cajas (Sessions)

#### `GET /sessions`

**Resumen:** Listar sesiones de caja.  
**Descripción:** Retorna todas las sesiones de venta creadas, ordenadas por fecha reciente.

**Respuestas:**

- **200 OK:** Array de objetos tipo `Session`.

#### `POST /sessions`

**Resumen:** Abrir una nueva sesión de caja.  
**Descripción:** Crea una nueva sesión (ej: "Turno Mañana 2024-05-20").

**Cuerpo de la Petición:**

```json
{
  "name": "Nombre de la Sesión"
}
```

**Respuestas:**

- **201 Created:** Sesión creada.
- **400 Bad Request:** Si falta el nombre.

---

## 🛠️ Modelos de Datos (Schemas)

### Session

| Campo       | Tipo     | Descripción         |
| :---------- | :------- | :------------------ |
| `id`        | UUID     | Identificador único |
| `name`      | String   | Nombre de la sesión |
| `createdAt` | DateTime | Fecha de apertura   |

### Product

| Campo      | Tipo    | Descripción                   |
| :--------- | :------ | :---------------------------- |
| `id`       | Int     | Identificador autoincremental |
| `name`     | String  | Nombre del dulce              |
| `price`    | Decimal | Precio base                   |
| `currency` | String  | Moneda (USD/VES)              |
| `active`   | Boolean | Estado de disponibilidad      |

### Sale

| Campo       | Tipo    | Descripción               |
| :---------- | :------ | :------------------------ |
| `id`        | UUID    | Identificador de la venta |
| `total_usd` | Decimal | Total en divisa           |
| `total_bs`  | Decimal | Total en moneda local     |
| `tasa_bcv`  | Decimal | Tasa de cambio aplicada   |

---

> [!TIP]
> **Recomendación:** Para pruebas rápidas, utiliza el `sessionId` obtenido del endpoint `GET /sessions` en los parámetros de ruta de ventas.
