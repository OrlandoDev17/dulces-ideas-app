# PRD: Dulces Ideas - CRM & Sales System

## 1. Introducción y Objetivo

**Dulces Ideas** es una aplicación de punto de venta (POS) y gestión de clientes diseñada para agilizar el proceso de ventas en negocios locales venezolanos. El objetivo principal es reducir la fricción en el cobro multimoneda y automatizar el cálculo de conversiones basadas en la tasa oficial del BCV.

## 2. Definición del Producto

### 2.1 Problemas a Resolver

- Complejidad en el cálculo manual de productos en USD pagados en Bolívares (Bs).
- Dificultad para registrar ventas que involucran múltiples métodos de pago (ej: una parte en divisas y otra en pago móvil).
- Falta de una interfaz moderna y rápida para el registro de transacciones.

### 2.2 Público Objetivo

- Cajeros y dueños de tiendas minoristas (específicamente "Dulces Ideas").
- Operadores que necesiten una herramienta rápida y visual en dispositivos táctiles.

## 3. Requerimientos Funcionales (FR)

- **FR1: Selección de Productos:** El usuario debe poder navegar por categorías y añadir productos al carrito con un solo clic.
- **FR2: Gestión de Carrito:** Ajuste de cantidades, eliminación de productos y visualización de totales en tiempo real.
- **FR3: Integración de Tasa Cambiaria:** Obtención automática de la tasa BCV del día para cálculos precisos.
- **FR4: Módulo de Pago Mixto:**
  - Selección de múltiples métodos de pago.
  - Validación de montos restantes.
  - Conversión instantánea entre USD y Bs dentro del modal de pago.
- **FR5: Registro de Venta:** Consolidación de la transacción y vaciado del carrito tras la confirmación.

## 4. Documentación Técnica

### 4.1 Arquitectura del Sistema

- **Frontend Monolítico (Monorepo):** Utiliza una estructura de monorepo gestionada por Bun Workspaces para escalabilidad futura.
- **Arquitectura de Componentes:** Basada en el principio de responsabilidad única (SRP), separando componentes de UI (Tailwind) de la lógica de estado (React Hooks).

### 4.2 Stack Tecnológico Detallado

- **Next.js 15 (App Router):** Aprovecha el Server-Side Rendering (SSR) para la carga inicial y Client Components para la interactividad del POS.
- **Tailwind CSS v4:** Implementa un sistema de diseño basado en tokens personalizados y utilidades de última generación para una UI premium.
- **Motion (Framer Motion):** Gestiona las transiciones de estado, modales y animaciones de listas (AnimatePresence) para mejorar la UX.

### 4.3 Gestión de Estado

- **React State (Local):** Actualmente se utiliza `useState` y `useMemo` para la gestión del carrito y pagos, asegurando una respuesta inmediata sin latencia de red innecesaria para operaciones simples.
- **Hooks Personalizados:**
  - `useTasaBCV`: Centraliza la lógica de fetching y actualización de la tasa de cambio.

### 4.4 Integraciones y APIs

- **Servicio de Tasa BCV:** Hook encargado de consumir datos de tasas oficiales (simulado o via proxy API para evitar CORS).
- **Servicio de Fecha/Hora:** Localizado para Venezuela para asegurar que los registros de caja coincidan con la zona horaria real (UTC-4).

## 5. Roadmap y Futuras Mejoras

- **Fase 2:** Integración con base de datos (Supabase/PostgreSQL) para persistencia de ventas.
- **Fase 3:** Sistema de inventario con alertas de stock bajo.
- **Fase 4:** Panel de analíticas para visualizar productos más vendidos y reportes diarios de caja.
- **Fase 5:** Soporte Offline (PWA) para ventas sin conexión a internet.

---

**Versión:** 1.0.0  
**Fecha:** Febrero 2026
