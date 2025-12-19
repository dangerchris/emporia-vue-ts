import type { TokenStorage, TokenStorageProvider } from "../types/config";

/**
 * File-based token storage using Node.js fs/promises.
 * Tokens are persisted to a JSON file on disk.
 *
 * @example
 * ```typescript
 * import { EmporiaVue } from "emporia-vue";
 * import { FileTokenStorage } from "emporia-vue/storage";
 *
 * const vue = new EmporiaVue();
 * await vue.login({
 *   username: "user@example.com",
 *   password: "password",
 *   tokenStorage: new FileTokenStorage("./tokens.json"),
 * });
 * ```
 */
export class FileTokenStorage implements TokenStorageProvider {
  constructor(private readonly filePath: string) {}

  async load(): Promise<TokenStorage | null> {
    const fs = await import("node:fs/promises");
    try {
      const content = await fs.readFile(this.filePath, "utf-8");
      return JSON.parse(content) as TokenStorage;
    } catch {
      return null;
    }
  }

  async save(tokens: TokenStorage): Promise<void> {
    const fs = await import("node:fs/promises");
    await fs.writeFile(this.filePath, JSON.stringify(tokens, null, 2));
  }

  async clear(): Promise<void> {
    const fs = await import("node:fs/promises");
    try {
      await fs.unlink(this.filePath);
    } catch {
      // File doesn't exist, ignore
    }
  }
}
