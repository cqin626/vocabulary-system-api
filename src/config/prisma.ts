import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import { PrismaClient } from "../generated/prisma/client.js";
import { getEnvVarOrThrow } from "../shared/utils/envUtils.js";

const adapter = new PrismaMariaDb({
  host: getEnvVarOrThrow("DATABASE_HOST"),
  user: getEnvVarOrThrow("DATABASE_USER"),
  password: getEnvVarOrThrow("DATABASE_PASSWORD"),
  database: getEnvVarOrThrow("DATABASE_NAME"),
  connectionLimit: 5,
});

export const prisma = new PrismaClient({ adapter });
