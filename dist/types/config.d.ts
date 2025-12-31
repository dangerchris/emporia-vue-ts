export interface EmporiaVueConfig {
    connectTimeout?: number;
    readTimeout?: number;
}
/**
 * Interface for custom token storage implementations.
 * Implement this to store tokens in localStorage, databases, or other backends.
 */
export interface TokenStorageProvider {
    /** Load stored tokens, or return null if none exist */
    load(): Promise<TokenStorage | null>;
    /** Save tokens to storage */
    save(tokens: TokenStorage): Promise<void>;
    /** Clear stored tokens */
    clear(): Promise<void>;
}
export interface LoginOptions {
    username?: string;
    password?: string;
    idToken?: string;
    accessToken?: string;
    refreshToken?: string;
    /**
     * @deprecated Use `tokenStorage` with `FileTokenStorage` instead.
     * Path to file for storing authentication tokens.
     */
    tokenStorageFile?: string;
    /** Custom token storage provider for persisting authentication tokens */
    tokenStorage?: TokenStorageProvider;
}
export interface RetryOptions {
    maxRetryAttempts?: number;
    initialRetryDelay?: number;
    maxRetryDelay?: number;
}
export interface TokenStorage {
    username: string;
    idToken: string;
    accessToken: string;
    refreshToken: string;
}
//# sourceMappingURL=config.d.ts.map