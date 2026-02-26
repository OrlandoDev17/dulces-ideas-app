# Dulces Ideas - Sistema de Gestión 🍩

Bienvenido al repositorio principal de **Dulces Ideas**, una aplicación integral diseñada para la gestión de ventas, inventario y cajas de la tienda de dulces.

Este proyecto está dividido en dos partes principales (monorepo):

1. **El Servidor (Backend / API)**: Donde se guarda y procesa toda la información (Base de datos).
2. **La Vista (Frontend / Web)**: La aplicación que usas en tu navegador para interactuar con los datos.

---

## 🏗️ Estructura del Proyecto

```text
dulces-ideas-app/
├── apps/
│   ├── api/       # Código del servidor (Backend con Node.js, Express y Prisma)
│   └── web/       # Código de la interfaz de usuario (Frontend con React y Vite)
└── package.json   # Configuraciones globales del monorepo
```

---

## 🛠️ Tecnologías Principales

- **Base de Datos:** PostgreSQL (Neon)
- **Backend:** Node.js, Express, Prisma ORM
- **Frontend:** Next.js, TypeScript, TailwindCSS

---

## 📖 Documentación Específica

Para conocer más detalles sobre cada parte del sistema, puedes consultar las siguientes guías:

### 🖥️ Para el FrontEnd (La Interfaz Visual)

_Ubicado en la carpeta `apps/web/`_

- [Manual de Usuario (Para personas no técnicas)](./apps/web/MANUAL_USO.md): Cómo usar el sistema en el día a día.
- [Guía para Desarrolladores](./apps/web/README.md): Cómo instalar, ejecutar y modificar el código de la vista.

### ⚙️ Para el BackEnd (El Motor de Datos)

_Ubicado en la carpeta `apps/api/`_

- [Guía Básica del Servidor (Para personas no técnicas)](./apps/api/MANUAL_USO.md): Qué hace el servidor y por qué es importante.
- [Guía para Desarrolladores](./apps/api/README.md): Cómo configurar la base de datos, Prisma y crear nuevas rutas en el servidor.

---

## 🚀 Cómo ejecutar todo el proyecto a la vez (Para Desarrolladores)

Si deseas correr tanto el Frontend como el Backend instalados, deberás tener configurado y corriendo los respectivos servicios u usar herramientas de ejecución paralela (ej. `npm run dev` en la raíz si fue configurado de esa manera, o abrir dos consolas).

Para instrucciones paso a paso, refiérase a las guías de desarrolladores de cada carpeta (`apps/api/README.md` y `apps/web/README.md`).
