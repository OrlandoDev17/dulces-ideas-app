# Dulces Ideas - Servidor Central (Para Personas no Técnicas) 📦🖧

¡Hola! Esta guía es para que entiendas qué hace la parte "invisible" del sistema (el Backend o Servidor) de tu tienda Dulces Ideas.

---

## 🧐 ¿Qué es el "Servidor" y por qué lo necesitas?

Imagina que tu aplicación es un restaurante:

- El **Frontend** (la pantalla que ves y tocas) es como el mesonero o el menú, que te muestra las opciones de dulces y te permite pedir cosas.
- El **Servidor** (esta parte del sistema) es la gran cocina y el almacén, donde se procesan todas tus órdenes.

Cuando registras una venta, el menú (Frontend) le avisa a la cocina (Servidor). El servidor guarda esta información de forma segura en una "caja fuerte" llamada **Base de Datos**.

## 🧠 ¿Qué información maneja el servidor?

El servidor se encarga de recordar todo. Por ejemplo:

1. **Los Productos:** Todos los dulces, pasteles, y postres que vendes. Qué precio tienen en Dólares (USD) o Bolívares (VES), y si están activos o no para la venta.
2. **Las Categorías:** Agrupa tus dulces (Ej: "Donas", "Tortas", "Bebidas").
3. **Las Ventas:** Recuerda qué producto vendiste, cuántos, con qué método te pagaron (Punto de Venta, Zelle, Efectivo), la tasa del Banco Central (BCV) de ese día, y la hora exacta en la que lo hiciste.
4. **Las Cajas / Sesiones:** Ayuda a agrupar todas las ventas de un día o de un turno en específico, para que sepas cuánto dinero entró hoy versus ayer.

## 🔒 ¿Qué significa que use "Base de Datos Neon (PostgreSQL)"?

Significa que todos tus datos están seguros y ordenados. Si apagas tu computadora o se va la luz, toda tu información de ventas e inventario no se pierde, porque está almacenada allí.

## 🚦 Reglas del Servidor

El servidor sigue unas reglas estrictas antes de guardar un dato, para evitar errores:

- **No te deja crear ventas vacías:** Si en el cajero le das a registrar venta y no pusiste ni un caramelo, el servidor dirá "¡Alto! Falta el dulce".
- **Lleva las cuentas precisas:** Calcula internamente las sumas en bolívares y en dólares, verificando que los métodos de pago coincidan con la venta, asegurándose de que lo que metes a la caja es lo que ingresó.

## 🤔 Preguntas Frecuentes

1. **¿Si cambio un precio de un dulce en la Base de Datos, se actualiza en el punto de venta?**  
   ¡Sí, automáticamente! Cada vez que abres el cajero en elFrontend, este le pregunta los precios actualizados al Servidor.

2. **¿Tengo que entrar aquí todos los días a revisar el servidor?**  
   ¡No, para nada! Como administrador o usuario del día a día, toda la información la verás cómodamente desde el Frontend (la interfaz web). El servidor simplemente trabaja solo en segundo plano como un relojito suizo.

3. **¿Qué hago si la pantalla de la caja me dice "Error de conexión al servidor"?**  
   Significa que la interfaz web (el Frontend) no pudo comunicarse con el servidor (esta parte del sistema). Esto pasa si no hay internet o si el servidor está apagado/detenido temporalmente por mantenimiento. Contacta a la persona técnica de tu sistema.
