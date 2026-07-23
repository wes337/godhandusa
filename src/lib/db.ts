import postgres from "postgres";

declare global {
  // eslint-disable-next-line no-var
  var __sql: ReturnType<typeof postgres> | undefined;
}

const sql =
  globalThis.__sql ??
  postgres(process.env.POSTGRES_URL as string, {
    max: 5,
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__sql = sql;
}

export default sql;
