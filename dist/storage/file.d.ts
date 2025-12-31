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
export declare class FileTokenStorage implements TokenStorageProvider {
    private readonly filePath;
    constructor(filePath: string);
    load(): Promise<TokenStorage | null>;
    save(tokens: TokenStorage): Promise<void>;
    clear(): Promise<void>;
}
//# sourceMappingURL=file.d.ts.map