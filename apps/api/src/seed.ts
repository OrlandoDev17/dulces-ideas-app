import { sql } from "./config/db";
import { POSTRES, TORTAS_COMPLETAS, BEBIDAS } from "../../web/src/lib/Mock";

async function seed() {
  try {
    console.log("🚀 Iniciando migración de productos...");

    // 1. Insertar Categorías y obtener sus IDs
    const catPostres =
      await sql`INSERT INTO categories (name) VALUES ('Postres / Raciones') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`;
    const catTortas =
      await sql`INSERT INTO categories (name) VALUES ('Tortas Completas') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`;
    const catBebidas =
      await sql`INSERT INTO categories (name) VALUES ('Bebidas') ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id`;

    if (!catPostres[0] || !catTortas[0] || !catBebidas[0]) {
      throw new Error(
        "Error: No se pudieron obtener los IDs de las categorías integradas.",
      );
    }

    const ids = {
      postres: catPostres[0].id,
      tortas: catTortas[0].id,
      bebidas: catBebidas[0].id,
    };

    // 2. Función para insertar productos en lote
    const insertProducts = async (items: any[], categoryId: number) => {
      for (const item of items) {
        await sql`
          INSERT INTO products (name, price, currency, category_id)
          VALUES (${item.name}, ${item.price}, ${item.currency}, ${categoryId})
        `;
      }
    };

    await insertProducts(POSTRES, ids.postres);
    await insertProducts(TORTAS_COMPLETAS, ids.tortas);
    await insertProducts(BEBIDAS, ids.bebidas);

    console.log("✅ Migración completada con éxito");
  } catch (error) {
    console.error("❌ Error en la migración:", error);
  } finally {
    process.exit();
  }
}

seed();
