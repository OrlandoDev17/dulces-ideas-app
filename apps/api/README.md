# Dulces Ideas API - Guía para Desarrolladores 💻⚙️

Bienvenido a la carpeta del Backend (`apps/api`). Aquí reside toda la lógica de negocio, reglas del servidor y comunicación con la Base de Datos para el sistema **Dulces Ideas**.

---

## 🛠️ Stack Tecnológico

- **Entorno:** Node.js
- **Framework Web:** Express.js `v5.x`
- **Lenguaje Principal:** TypeScript
- **ORM (Mapeo de Datos):** Prisma ORM `v7.x`
- **Base de Datos:** PostgreSQL usando el servicio Neon Serverless.
- **Variables de Entorno:** dotenv

---

## 📂 Organización de las Carpetas

La arquitectura del servidor sigue un modelo modular tradicional, dividiendo la lógica por entidades o "dominios":

```text
apps/api/
├── prisma/
│   ├── schema.prisma      # Tu modelo de Base de Datos. Todas tus "tablas" viven aquí.
│   └── migrations/        # Historial de cambios a la estructura de la base de datos (SQL).
│
├── src/
│   ├── config/            # Configuraciones globales (Conexión Prisma, variables de entorno).
│   ├── generated/         # Clientes autogenerados de Prisma, código interno.
│   │
│   ├── modules/           # Módulos del negocio.
│   │   ├── products/      # Consultas del catálogo de dulces y métodos de pago.
│   │   ├── sales/         # Registro de transacciones de venta, historial y balances.
│   │   └── sessions/      # Gestión de la apertura/cierre de cajas, turnos.
│   │
│   ├── routes/            # Aquí se enlazan los enrutadores de los módulos y se exportan (v1, etc).
│   └── server.ts          # Punto de entrada de la aplicación Express.
│
├── .env                   # ¡Tus credenciales y URLs secretas! (No se sube a GitHub).
└── package.json           # Dependencias y scripts del proyecto backend.
```

---

## 🔗 Estructura de las Rutas (EndPoints)

Cada módulo exporta rutas usando los **Controladores** (`controller.ts`) y **Servicios** (`service.ts`). Los servicios ejecutan las consultas a Prisma y los controladores manejan las respuestas web o los errores HTTP.

```text
# PRODUCTOS Y PAGOS (Para pintar el Frontend)
GET /products          -> Devuelve catálogo de productos agrupados por categorías.
GET /payment-methods   -> Devuelve lista de métodos de pago (Punto, Efectivo, Zelle).

# VENTAS (Registro y Reportes)
POST /sales                  -> Registra una nueva Venta con múltiples items y múltiples pagos (Transacción usando Prisma Nested Writes).
GET /sales/recent/:sessionId -> Devuelve la lista histórica de ventas recientes de una sesión/caja específica.
GET /sales/balance/:sessionId-> Devuelve los pagos sumados y agrupados por método de pago para los cuadritos de balance final.

# SESIONES / CAJAS (Turnos de trabajo)
GET /sessions          -> Obtiene el historial de cajas/sesiones.
POST /sessions         -> Abre una nueva caja o sesión para este turno.
```

---

## ⚙️ Prisma ORM - Configuración y Uso

Recientemente se migró el cliente ORM de librerías antiguas a Prisma para garantizar un tipado de datos estricto en el backend y evitar errores inesperados.

### 📝 1. ¿Cómo modificar la Base de Datos?

Si necesitas agregar una nueva columna a los productos (ej: "Stock" o "Descuentos"):

1. Abre `apps/api/prisma/schema.prisma`
2. Modifica o agrega tu modelo de datos (`model Product { ... }`).
3. Guarda y abre tu consola terminal:

   ```bash
   # Primero nos aseguramos de estar en la carpeta api
   cd apps/api

   # Genera la migración (escribirá el código SQL interno)
   npx prisma migrate dev --name agregando_stock
   ```

4. Con esto, Prisma cambiará tu base de datos y generará nuevos tipos de Typescript.

### 🔌 2. ¿Cómo funciona la conexión actual?

Revisar `src/config/prisma.ts`. Estás utilizando **PrismaNeon** adapter para aprovechar funciones _serverless_ y optimizar latencia, en conjunto con un client de la ruta generada `src/generated/prisma`.

**IMPORTANTE:** Si tu base de datos en .env (DATABASE_URL y DIRECT_URL) tiene un error de conexión, Prisma fallará. Asegúrate de que las contraseñas estén correctamente escritas.

---

## 🚀 ¿Cómo empezar a desarrollar aquí?

1. **Abre una terminal** y dirígete a `apps/api`.
   ```bash
   cd apps/api
   ```
2. **Instala dependencias**
   ```bash
   npm install
   ```
3. **Crea el archivo de Entorno**
   - Asegúrate de tener o crear el archivo `.env` en la raíz de `api`. Dicho archivo debe contener tus tokens a la base de datos de Neon:
   ```env
   DATABASE_URL="postgres://..."
   DIRECT_URL="postgres://..."
   ```
4. **Prueba que tu Schema está bien:**
   ```bash
   npx prisma generate
   ```
5. **Corre en ambiente de desarrollo**
   ```bash
   npm run dev
   ```
   **(El servidor debería iniciar en el puerto 5000 o el que designes tu).**

---

## ⚠️ Buenas Prácticas y Manejo de Errores

Recientemente hemos corregido errores estrictos tipo TS en los controladores:

- **Null Safety en Ventas:** Recuerda que si consultas información agrupada en `getBalance`, siempre revisa propiedades usando `?` (null check) (Ej: `curr.method?.name || "Desconocido"`), de este modo si algún dato faltara Express no explotará con el famoso `"Property is possibly null"`.
- **Rutas Express 5.x:** Estamos usando Express versión 5. Esto significa que Express maneja nativamente promesas asíncronas caídas.
- **Separación de Responsabilidades:** No coloques código de base de datos directamente en el router. Siempre enrruta a un Controller (`controller.ts`) y que el Controller consulte (o derive a un `service.ts`).
