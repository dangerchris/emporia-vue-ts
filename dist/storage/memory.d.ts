import type { TokenStorage, TokenStorageProvider } from "../types/config";
/**
 * In-memory token storage. Tokens are lost when the process ends.
 * Useful for testing or browser environments where you manage token persistence elsewhere.
 */
export declare class MemoryTokenStorage implements TokenStorageProvider {
    private tokens;
    load(): Promise<TokenStorage | null>;
    save(tokens: TokenStorage): Promise<void>;
    clear(): Promise<void>;
}
//# sourceMappingURL=memory.d.ts.map