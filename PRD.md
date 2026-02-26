# Product Requirement Document (PRD)

## Propósito del Sistema

El sistema tiene como objetivo principal la **gestión de ventas rápidas y la operación fluida de cajas múltiples sincronizadas**. Actúa como un Punto de Venta (POS) que facilita a los cajeros el registro inmediato de productos, soportando múltiples métodos de pago combinados en escenarios bimonetarios.

## Flujo de Usuario

1. **Selección de Productos**: El operador busca y añade productos desde distintas categorías usando un selector interactivo.
2. **Gestión de Carrito**: Los productos seleccionados se visualizan en un resumen en tiempo real, agrupando montos exactos de la orden activa.
3. **Pago Mixto**: Si el cliente va a cancelar con múltiples métodos, el operador ingresa las fracciones de pago en Dólares ($) y Bolívares (Bs) simultáneamente.
4. **Registro**: Se confirma el pago, despachando la orden al historial (y sincronizando con las sesiones).

## Reglas de Negocio (Implementadas en el Código)

- **Manejo de tasa de cambio (BCV)**: El total en Dólares o Bolívares se calcula de forma dinámica basándose en la moneda base del producto y la tasa BCV del día (`tasa` proveniente del hook `useTasaBCV`). Si la moneda base es "VES", no se multiplica por la tasa, se suma directamente en BS.
- **Lógica de redondeo a 2 decimales**: Para mantener consistencia financiera, en componentes clave como `ActiveSale.tsx` se emplea `Math.round(valor * 100) / 100` (Ej. `totalBSRounded`).
- **Validación de montos en pagos mixtos**: El componente utiliza el custom hook `useMixedPayment` para calcular el monto `remainingBs`. El sistema impide confirmar (`isComplete: false`) hasta que el saldo pendiente no sea completamente cubierto. No permite sobrepasar el total exacto de forma descontrolada.
- **Persistencia de carritos por nombre de sesión**: Los estados del sistema pueden guardarse y recuperarse en la sesión local, manteniendo el progreso del cajero incluso entre recargas, optimizando así la operatoria de cajas.
