# Documentación Técnica

## Sección Funcional (No-Devs)

### Sesiones Compartidas (Cajas Múltiples)

El diseño del POS está pensado para un esquema de **Sesiones Compartidas**. Esto significa que diferentes dispositivos (o cajas) pueden mantener su contexto y estado de venta sin que la información se pierda o colisione. La interfaz guarda el carrito temporalmente en la sesión activa; así, si hay interrupciones o cambios de usuario, la venta se mantiene pausada y segura.

### Conversión Automática de Moneda

De forma invisible para el operador, el sistema posee un motor de conversión. Al agregar un producto tasado en Dólares ($), este muestra automáticamente su valor equivalente en Bolívares (Bs), utilizando una Tasa de Cambio referencial (BCV) alimentada al día. El sistema sabe identificar qué productos se tarifan en Bolívares directamente para no convertirlos indebidamente.

---

## Arquitectura por Vistas

### 1. Vista de Ventas (Interacción Principal)

La vista `VentasPage` articula el flujo de ventas donde interactúan múltiples subcomponentes.

- **ProductSelector**: Es el encargado de mostrar las categorías de productos (mediante el ícono de "más"). Permite seleccionar un producto, especificar la cantidad y emitir el evento `onAddToCart`.
- **ActiveSale**: Es el componente contenedor de la "Orden Actual". Escucha los ítems provenientes del `ProductSelector` mediante el estado global de la vista. Computa de forma memorizada (`useMemo`) los totales y agrupa opciones críticas (como el `DeliveryToggle` o método de pago). Contiene la acción definitiva de `Registrar Venta`.

![Vista de Ventas]([INSERTAR CAPTURA: VISTA_VENTAS])

### 2. Componentes Genéricos

**`OptionDropdown<T>`**
Este es un componente clave, diseñado mediante **Generics** (`<T>`) de TypeScript. Esto permite que el mismo bloque de interfaz reaccione y renderice tanto una lista de `Product` como una de `PaymentMethod` con un código limpio. Utiliza propiedades funcionales como `getLabel` y `getExtra`. Esta arquitectura fuertemente tipada nos asegura reutilización sin depender de tipos `any`.

---

## Lógica de Pago

La venta puede pagarse por un "Pago Rápido" (1 solo método) o un **Pago Mixto**.

- **Calculando el Restante**: En el componente `MixedPaymentModal.tsx` se apoya en `useMixedPayment`. A medida que el usuario agrega métodos (Ej. Divisas: $10, Pago Móvil: 2000 Bs), el sistema convierte el monto en dólares de Divisas a bolívares y resta todo del `totalToPayBs`.
- **Manejo Simultáneo ($ y Bs)**: La interfaz bloquea el registro hasta que la variable `remainingBs` llegue exactamente a 0 o al saldo mínimo permitido, asegurando el cuadre exacto en caja.

![Pago Mixto]([INSERTAR CAPTURA: MODAL_PAGO_MIXTO])

---

## Estructura de Datos (Interfaces Claves)

Las interfaces que sostienen la comunicación de datos se encuentran en `types.ts`:

| Entidad        | Campos Principales                         | Responsabilidad                                                                                                                                                |
| :------------- | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **`Product`**  | `name`, `price`, `currency`                | Modela la base de cualquier artículo tarifado en el sistema, sea en $ o Bs.                                                                                    |
| **`CartItem`** | Extiende de Product + `id`, `quantity`     | Define un artículo ya seleccionado dentro de un carrito, permitiendo sumar cantidades de una misma entidad en `ActiveSale`.                                    |
| **`Payment`**  | `id`, `method`, `amountBs`, `amountRef`    | Guarda la relación entre un método de pago, el monto asentado en Bs y su equivalente referencial (`amountRef`). Sirve para armar el histórico de pagos mixtos. |
| **`Sale`**     | `items`, `totalUSD`, `totalBS`, `payments` | La agregación final. Una `Sale` engloba un arreglo de `CartItem`, montos absolutos computados, detalles de Delivery y el desglose de los pagos.                |
