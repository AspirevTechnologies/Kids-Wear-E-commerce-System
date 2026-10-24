/**
 * SADP Pattern: Singleton (Creational)
 * Ensures only one central in-memory / cache data store instance exists across Next.js requests.
 */
export class DatabaseClient {
  private static instance: DatabaseClient | null = null;
  private storage: Map<string, any>;

  private constructor() {
    this.storage = new Map<string, any>();
  }

  public static getInstance(): DatabaseClient {
    const globalRef = globalThis as unknown as { __ls_database_client__?: DatabaseClient };
    if (!globalRef.__ls_database_client__) {
      globalRef.__ls_database_client__ = new DatabaseClient();
    }
    return globalRef.__ls_database_client__;
  }

  public get<T>(key: string): T | undefined {
    return this.storage.get(key) as T;
  }

  public set<T>(key: string, value: T): void {
    this.storage.set(key, value);
  }

  public has(key: string): boolean {
    return this.storage.has(key);
  }

  public delete(key: string): boolean {
    return this.storage.delete(key);
  }
}
