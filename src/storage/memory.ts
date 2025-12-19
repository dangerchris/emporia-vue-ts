import type { TokenStorage, TokenStorageProvider } from "../types/config";

/**
 * In-memory token storage. Tokens are lost when the process ends.
 * Useful for testing or browser environments where you manage token persistence elsewhere.
 */
export class MemoryTokenStorage implements TokenStorageProvider {
  private tokens: TokenStorage | null = null;

  async load(): Promise<TokenStorage | null> {
    return this.tokens;
  }

  async save(tokens: TokenStorage): Promise<void> {
    this.tokens = tokens;
  }

  async clear(): Promise<void> {
    this.tokens = null;
  }
}
