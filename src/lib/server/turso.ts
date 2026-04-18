// Turso Database Client - Server Side Only
// This module should only be imported in +server.ts files
import { createClient, type Client, type InValue } from '@libsql/client';
import { env } from '$env/dynamic/private';

// Game data database client (daily-food-chain)
let gameClient: Client | null = null;

export function getGameDb(): Client {
  if (!gameClient) {
    // Trim to handle potential newlines/whitespace in env vars
    const url = env.TURSO_DATABASE_URL?.trim();
    const authToken = env.TURSO_AUTH_TOKEN?.trim();
    if (!url || !authToken) {
      throw new Error('Missing TURSO_DATABASE_URL or TURSO_AUTH_TOKEN environment variables');
    }
    gameClient = createClient({
      url,
      authToken
    });
  }
  return gameClient;
}

// SR28 Legacy reference database client (DataCentralCombo)
// Dev:  set TURSO_SR28_URL=file:/absolute/path/to/comboo.db  (no auth token needed)
// Prod: set TURSO_SR28_URL + TURSO_SR28_TOKEN to the Turso DB once synced
let sr28Client: Client | null = null;

export function getSR28Db(): Client {
  if (!sr28Client) {
    const url = env.TURSO_SR28_URL?.trim();
    if (!url) throw new Error('Missing TURSO_SR28_URL environment variable');
    const authToken = env.TURSO_SR28_TOKEN?.trim();
    sr28Client = createClient(authToken ? { url, authToken } : { url });
  }
  return sr28Client;
}

// Branded foods database client (for barcode/nutrition lookup)
let brandedClient: Client | null = null;

export function getBrandedDb(): Client {
  if (!brandedClient) {
    // Trim to handle potential newlines/whitespace in env vars
    const url = env.TURSO_BRANDED_URL?.trim();
    const authToken = env.TURSO_BRANDED_TOKEN?.trim();
    if (!url || !authToken) {
      throw new Error('Missing TURSO_BRANDED_URL or TURSO_BRANDED_TOKEN environment variables');
    }
    brandedClient = createClient({
      url,
      authToken
    });
  }
  return brandedClient;
}

// Helper for single row queries
export async function queryOne<T>(sql: string, args: InValue[] = []): Promise<T | null> {
  const db = getGameDb();
  const result = await db.execute({ sql, args });
  return (result.rows[0] as T) ?? null;
}

// Helper for multiple row queries  
export async function queryAll<T>(sql: string, args: InValue[] = []): Promise<T[]> {
  const db = getGameDb();
  const result = await db.execute({ sql, args });
  return result.rows as T[];
}

// Helper for insert/update/delete
export async function execute(sql: string, args: InValue[] = []): Promise<number> {
  const db = getGameDb();
  const result = await db.execute({ sql, args });
  return result.rowsAffected;
}

// Helper for transactions
export async function transaction<T>(fn: (tx: Client) => Promise<T>): Promise<T> {
  const db = getGameDb();
  // Note: libsql-client doesn't have built-in transaction support like better-sqlite3
  // For now, execute sequentially. For true transactions, consider batch API.
  return fn(db);
}
