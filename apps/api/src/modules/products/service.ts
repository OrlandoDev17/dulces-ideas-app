import { sql } from "../../config/db";

export const ProductsService = {
  // Obtener todos los productos agrupados por categoría
  async getAllGrouped() {
    const categories = await sql`SELECT * FROM categories ORDER BY id ASC`;
    const products = await sql`SELECT * FROM products WHERE active = true`;

    return categories.map((cat) => ({
      label: cat.name,
      options: products.filter((p) => p.category_id === cat.id),
    }));
  },

  // Insertar categorías iniciales
  async seedCategories() {
    return await sql`
      INSERT INTO categories (name) 
      VALUES ('Postres / Raciones'), ('Tortas Completas'), ('Bebidas')
      ON CONFLICT (name) DO NOTHING
    `;
  },

  // Insertar un producto
  async addProduct(data: any) {
    return await sql`
      INSERT INTO products (category_id, name, price, currency)
      VALUES (${data.category_id}, ${data.name}, ${data.price}, ${data.currency})
      RETURNING *
    `;
  },
};
