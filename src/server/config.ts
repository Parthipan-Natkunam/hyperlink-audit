import { config as envConfig } from "dotenv";

export type AppConfiguration = {
  port: number;
};

envConfig({ path: __dirname + "/.env" });

export const config: AppConfiguration = {
  port: process.env.PORT ? Number(process.env.PORT) : 8000,
};
