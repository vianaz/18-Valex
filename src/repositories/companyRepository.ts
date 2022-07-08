import { connection } from "../db/database";

export interface Company {
  id: number;
  name: string;
  apiKey?: string;
}

export async function findByApiKey(apiKey: string) {
  const result = await connection.query<Company>(
    `SELECT * FROM companies WHERE "apiKey"=$1`,
    [apiKey]
  );

  return result.rows[0];
}
