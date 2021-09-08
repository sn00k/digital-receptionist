import { Employee } from "../models/Employee";
import { getConnection, createConnection } from "typeorm";

export async function getOrCreateConnection() {
  try {
    const conn = getConnection();
    return conn;
  } catch (e) {
    return createConnection({
      type: "postgres",
      host: process.env.POSTGRES_HOST as string,
      port: parseInt(process.env.POSTGRES_PORT as string),
      username: process.env.POSTGRES_USER as string,
      password: process.env.POSTGRES_PASSWORD as string,
      database: process.env.POSTGRES_DB as string,
      entities: [Employee],
      synchronize: true,
      logging: false,
    });
  }
}
