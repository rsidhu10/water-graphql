import { config } from "dotenv";
const { parsed } = config();

export const {
  PORT,
  MODE,
  DUSER,
  DATABASE,
  PASSCODE,
  IN_PROD = MODE !== "prod",
} = parsed;
