import { Pool } from "pg";

declare global {
    // eslint-disable-next-line no-var
    var pgPool: Pool | undefined;
}

if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
}

export const db =
    global.pgPool ??
    new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl:
            process.env.NODE_ENV === "production"
                ? { rejectUnauthorized: false }
                : false,
        max: 10,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
    });

if (process.env.NODE_ENV !== "production") {
    global.pgPool = db;
}

// Optional but very helpful while debugging
db.on("connect", () => {
    console.log("Postgres pool connected");
});

db.on("error", (err: any) => {
    console.error("Postgres pool error:", err);
});