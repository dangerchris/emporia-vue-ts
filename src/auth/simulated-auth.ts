import type { AuthProvider, AuthTokens } from "./index";

export class SimulatedAuth implements AuthProvider {
  private host: string;
  private tokens: AuthTokens = {
    idToken: "simulated-id-token",
    accessToken: "simulated-access-token",
    refreshToken: "simulated-refresh-token",
  };

  constructor(host: string) {
    this.host = host.endsWith("/") ? host.slice(0, -1) : host;
  }

  async login(_username: string, _password: string): Promise<AuthTokens> {
    return this.tokens;
  }

  async loginWithTokens(tokens: Partial<AuthTokens>): Promise<AuthTokens> {
    if (tokens.idToken) this.tokens.idToken = tokens.idToken;
    if (tokens.accessToken) this.tokens.accessToken = tokens.accessToken;
    if (tokens.refreshToken) this.tokens.refreshToken = tokens.refreshToken;
    return this.tokens;
  }

  async refreshTokens(): Promise<AuthTokens> {
    return this.tokens;
  }

  async request<T>(
    method: "GET" | "PUT" | "POST" | "DELETE",
    url: string,
    data?: unknown,
    params?: Record<string, string>
  ): Promise<T> {
    const fullUrl = url.startsWith("http") ? url : `${this.host}${url}`;
    const urlWithParams = params
      ? `${fullUrl}?${new URLSearchParams(params).toString()}`
      : fullUrl;

    const response = await fetch(urlWithParams, {
      method,
      headers: {
        authtoken: this.tokens.idToken,
        "Content-Type": "application/json",
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const text = await response.text();
    if (!text) {
      return {} as T;
    }
    return JSON.parse(text) as T;
  }

  getTokens(): AuthTokens {
    return { ...this.tokens };
  }

  setTokenUpdater(_callback: (tokens: AuthTokens) => void): void {
    // No-op for simulated auth
  }
}
