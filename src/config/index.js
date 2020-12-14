import { config } from "dotenv";
const { parsed } = config();

export const {
  PORT,
  MODE,
  DB_USER,
  SECRET,
  DB_DATABASE,
  DB_PASSCODE,
  IN_PROD = MODE !== "prod",
} = parsed;
