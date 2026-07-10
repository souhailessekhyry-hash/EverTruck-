import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { env } from "../lib/env";
import * as schema from "@db/schema";
import * as relations from "@db/relations";

const fullSchema = { ...schema, ...relations };

let instance: ReturnType<typeof drizzle<typeof fullSchema, mysql.Pool>>;
let queryClient: mysql.Pool;

export function getDb() {
  if (!instance) {
    queryClient = mysql.createPool({ uri: env.databaseUrl, connectionLimit: 10 });
    instance = drizzle(queryClient, {
      schema: fullSchema,
      mode: "default",
    });
  }
  return instance;
}
