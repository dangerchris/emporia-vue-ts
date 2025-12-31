import type { AuthProvider, AuthTokens } from "./index";
export declare class CognitoAuth implements AuthProvider {
    private userPool;
    private cognitoUser;
    private tokens;
    private tokenUpdater?;
    private readTimeout;
    constructor(_connectTimeout?: number, readTimeout?: number);
    login(username: string, password: string): Promise<AuthTokens>;
    loginWithTokens(tokens: Partial<AuthTokens>): Promise<AuthTokens>;
    refreshTokens(): Promise<AuthTokens>;
    request<T>(method: "GET" | "PUT" | "POST" | "DELETE", url: string, data?: unknown, params?: Record<string, string>): Promise<T>;
    getTokens(): AuthTokens;
    setTokenUpdater(callback: (tokens: AuthTokens) => void): void;
    private extractTokensFromSession;
}
//# sourceMappingURL=cognito-auth.d.ts.map