import "dotenv/config";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";

function getEnvVar(key: string): string {
  const value = process.env[key];
  if (!value) throw new Error(`Missing required environment variable: ${key}`);
  return value;
}

const adapter = new PrismaMariaDb({
  host: getEnvVar("DATABASE_HOST"),
  user: getEnvVar("DATABASE_USER"),
  password: getEnvVar("DATABASE_PASSWORD"),
  database: getEnvVar("DATABASE_NAME"),
  connectionLimit: 5,
});

const prisma = new PrismaClient({ adapter });

export { prisma };
