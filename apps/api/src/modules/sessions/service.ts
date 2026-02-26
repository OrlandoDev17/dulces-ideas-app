import { sql } from "../../config/db";

export const SessionsService = {
  async create(name: string) {
    return await sql`
      INSERT INTO sessions (name) VALUES (${name}) 
      RETURNING *
    `;
  },
  async getAll() {
    return await sql`SELECT * FROM sessions ORDER BY name ASC`;
  },
  async delete(id: string) {
    return await sql`DELETE FROM sessions WHERE id = ${id}`;
  },
};
