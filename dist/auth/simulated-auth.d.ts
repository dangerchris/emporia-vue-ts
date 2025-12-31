import type { AuthProvider, AuthTokens } from "./index";
export declare class SimulatedAuth implements AuthProvider {
    private host;
    private tokens;
    constructor(host: string);
    login(_username: string, _password: string): Promise<AuthTokens>;
    loginWithTokens(tokens: Partial<AuthTokens>): Promise<AuthTokens>;
    refreshTokens(): Promise<AuthTokens>;
    request<T>(method: "GET" | "PUT" | "POST" | "DELETE", url: string, data?: unknown, params?: Record<string, string>): Promise<T>;
    getTokens(): AuthTokens;
    setTokenUpdater(_callback: (tokens: AuthTokens) => void): void;
}
//# sourceMappingURL=simulated-auth.d.ts.map