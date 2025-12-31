export interface AuthTokens {
    idToken: string;
    accessToken: string;
    refreshToken: string;
}
export interface AuthProvider {
    login(username: string, password: string): Promise<AuthTokens>;
    loginWithTokens(tokens: Partial<AuthTokens>): Promise<AuthTokens>;
    refreshTokens(): Promise<AuthTokens>;
    request<T>(method: "GET" | "PUT" | "POST" | "DELETE", url: string, data?: unknown, params?: Record<string, string>): Promise<T>;
    getTokens(): AuthTokens;
    setTokenUpdater(callback: (tokens: AuthTokens) => void): void;
}
export { CognitoAuth } from "./cognito-auth";
export { SimulatedAuth } from "./simulated-auth";
//# sourceMappingURL=index.d.ts.map