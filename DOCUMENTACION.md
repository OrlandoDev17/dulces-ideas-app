# 📖 Documentación Técnica: Sistema de Encargos

He refactorizado el sistema de encargos siguiendo los estándares de **Vercel React Best Practices**. Ahora el código es más modular, fácil de mantener y con una separación clara de responsabilidades.

---

## 🏗️ Arquitectura del Proyecto

La lógica de la aplicación se ha dividido en cuatro capas principales:

### 1. ⚙️ Servicios (`services/`)

Los servicios son responsables de la **persistencia y lógica de negocio pura**. No tienen ninguna relación con la interfaz.

- **`orders.service.ts`**: Centraliza todas las operaciones de los encargos.
  - **Persistencia**: Guarda y lee de `localStorage`.
  - **Sincronización**: Al registrar un pago de un encargo, crea automáticamente un registro en el historial de **Ventas**.
  - **Cálculos**: Gestiona el cambio de estado (Espera -> Parcial -> Pagado) basado en el total abonado.

### 2. 🪝 Hooks Personalizados (`hooks/`)

Los hooks actúan como un **puente** entre los servicios y los componentes de React, manejando el estado de la UI.

- **`useOrders.ts`**: Proporciona a la página de encargos todo lo que necesita (lista filtrada, funciones para agregar, eliminar y pagar).
- **`useCurrencyConverter.ts`**: Encapsula la lógica de conversión de moneda. Detecta si un pago es en Bs o USD y calcula sus equivalencias y cobertura automáticamente.
- **`useTasaBCV.ts`**: (Existente) Provee la tasa actual del dólar.

### 3. 📚 Librerías y Utilidades (`lib/`)

Contiene funciones puras y definiciones que se usan en todo el proyecto.

- **`formatters.ts`**: Centraliza el formato de visualización usando la API nativa `Intl`.
  - `formatDate`: Fechas consistentes (Ej: 20 feb).
  - `formatBS`: Formato de moneda venezolana.
  - `formatUSD`: Formato de moneda americana.
- **`types.ts`**: Definiciones de interfaces de TypeScript para asegurar que no haya errores de datos.

### 4. 🧩 Componentes (`components/orders/`)

Ahora los componentes son "tontos", es decir, se encargan solo de **mostrar información y recibir eventos**.

- **`OrderCard.tsx`**: Visualiza la información del encargo con diseño premium. Delegó sus cálculos pesados a las utilerías de formateo.
- **`AddOrderModal.tsx`**: Formulario semántico complejo que usa `useCurrencyConverter` para manejar los pagos iniciales de forma fluida.
- **`RecordPaymentModal.tsx`**: Modal dedicado exclusivamente a registrar nuevos abonos, mostrando el saldo pendiente con claridad.

---

## 🔝 Mejores Prácticas Aplicadas

1.  **Semántica HTML5**: Uso de etiquetas como `<article>`, `<section>`, `<time>`, `<fieldset>` y `<legend>` para mejor accesibilidad y SEO técnico.
2.  **Accesibilidad (ARIA)**: Implementación de roles (`role="dialog"`, `role="progressbar"`) y etiquetas descriptivas (`aria-label`) para lectores de pantalla.
3.  **Separación de Preocupaciones (SoC)**: Los componentes no saben _cómo_ se guardan los datos, solo llaman a una función del hook.
4.  **DRY (Don't Repeat Yourself)**: La lógica de conversión de moneda se escribió una sola vez en un hook y se reutiliza en ambos modales.
5.  **Internacionalización**: Uso de `Intl` para que las fechas y números sigan el estándar local de Venezuela.

---

_Desarrollado con ✨ por Antigravity (Advanced Agentic Coding)._
