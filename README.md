# 🍭 Dulces Ideas - CRM & Sales Management System

Un sistema moderno de gestión de ventas y caja diseñado específicamente para el mercado venezolano, optimizado para el manejo multimoneda y pagos mixtos con una interfaz premium.

## ✨ Características Principales

- **🛒 Carrito de Compras Inteligente:** Gestión fluida de productos, cantidades y eliminación de ítems.
- **💹 Tasa BCV Automática:** Integración en tiempo real con la tasa oficial del Banco Central de Venezuela.
- **💸 Pagos Mixtos Dinámicos:** Módulo avanzado para registrar pagos combinando diferentes métodos (USD, Bs Efectivo, Pago Móvil, Punto de Venta).
- **📱 Interfaz Ultra-Responsive:** Diseñada para tablets y móviles, con animaciones fluidas impulsadas por Framer Motion.
- **🎨 Diseño Premium:** Estética moderna, modo claro/oscuro refinado y micro-interacciones de alta calidad.

## 🛠️ Stack Tecnológico

- **Framework:** [Next.js 15](https://nextjs.org/) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/)
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animaciones:** [Framer Motion](https://www.framer.com/motion/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Runtime:** [Bun](https://bun.sh/)

## 🚀 Inicio Rápido

### Requisitos Previos

- [Bun](https://bun.sh/) instalado en tu sistema.

### Instalación

1. Clona el repositorio:

   ```bash
   git clone https://github.com/tu-usuario/dulces-ideas-app.git
   cd dulces-ideas-app
   ```

2. Instala las dependencias:

   ```bash
   bun install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   bun dev:web
   ```

## 📂 Estructura del Proyecto

```text
apps/
  web/                # Aplicación principal Next.js
    src/
      app/            # Rutas y páginas
      components/     # Componentes de UI (Ventas, Common, Layout)
      hooks/          # Hooks personalizados (Tasa BCV, etc)
      services/       # Lógica de negocio y servicios externos
      lib/            # Utilidades, tipos y constantes
```

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, abre un issue para discutir lo que te gustaría cambiar antes de enviar un pull request.

---

Hecho con con amor para **Dulces Ideas** 🍬
