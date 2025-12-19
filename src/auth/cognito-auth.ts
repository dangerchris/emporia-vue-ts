import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
  CognitoUserSession,
  CognitoRefreshToken,
} from "amazon-cognito-identity-js";
import { decodeJwt } from "jose";
import type { AuthProvider, AuthTokens } from "./index";
import {
  COGNITO_USER_POOL_ID,
  COGNITO_CLIENT_ID,
  API_BASE_URL,
  DEFAULT_CONNECT_TIMEOUT,
  DEFAULT_READ_TIMEOUT,
} from "../constants";
import { exponentialBackoff } from "../utils/retry";
import { AuthenticationError, ApiError, TimeoutError } from "../errors";

export class CognitoAuth implements AuthProvider {
  private userPool: CognitoUserPool;
  private cognitoUser: CognitoUser | null = null;
  private tokens: AuthTokens = {
    idToken: "",
    accessToken: "",
    refreshToken: "",
  };
  private tokenUpdater?: (tokens: AuthTokens) => void;
  private readTimeout: number;

  constructor(
    _connectTimeout = DEFAULT_CONNECT_TIMEOUT,
    readTimeout = DEFAULT_READ_TIMEOUT
  ) {
    this.userPool = new CognitoUserPool({
      UserPoolId: COGNITO_USER_POOL_ID,
      ClientId: COGNITO_CLIENT_ID,
    });
    this.readTimeout = readTimeout;
  }

  async login(username: string, password: string): Promise<AuthTokens> {
    return new Promise((resolve, reject) => {
      this.cognitoUser = new CognitoUser({
        Username: username,
        Pool: this.userPool,
      });

      const authDetails = new AuthenticationDetails({
        Username: username,
        Password: password,
      });

      this.cognitoUser.authenticateUser(authDetails, {
        onSuccess: (session: CognitoUserSession) => {
          this.extractTokensFromSession(session);
          resolve(this.tokens);
        },
        onFailure: (err) =>
          reject(new AuthenticationError(err.message || "Authentication failed")),
        newPasswordRequired: () => {
          reject(
            new AuthenticationError("New password required - not supported")
          );
        },
      });
    });
  }

  async loginWithTokens(tokens: Partial<AuthTokens>): Promise<AuthTokens> {
    if (tokens.idToken) this.tokens.idToken = tokens.idToken;
    if (tokens.accessToken) this.tokens.accessToken = tokens.accessToken;
    if (tokens.refreshToken) this.tokens.refreshToken = tokens.refreshToken;

    // Extract username from token to set up cognitoUser
    if (this.tokens.idToken) {
      try {
        const decoded = decodeJwt(this.tokens.idToken);
        const username = decoded["cognito:username"] as string;
        if (username) {
          this.cognitoUser = new CognitoUser({
            Username: username,
            Pool: this.userPool,
          });
        }
      } catch {
        // Token decode failed, continue without cognitoUser
      }
    }

    return this.tokens;
  }

  async refreshTokens(): Promise<AuthTokens> {
    if (!this.cognitoUser || !this.tokens.refreshToken) {
      throw new AuthenticationError("No user or refresh token available");
    }

    return new Promise((resolve, reject) => {
      const refreshToken = new CognitoRefreshToken({
        RefreshToken: this.tokens.refreshToken,
      });

      this.cognitoUser!.refreshSession(refreshToken, (err, session) => {
        if (err) {
          reject(new AuthenticationError(err.message || "Token refresh failed"));
          return;
        }
        this.extractTokensFromSession(session);
        this.tokenUpdater?.(this.tokens);
        resolve(this.tokens);
      });
    });
  }

  async request<T>(
    method: "GET" | "PUT" | "POST" | "DELETE",
    url: string,
    data?: unknown,
    params?: Record<string, string>
  ): Promise<T> {
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;
    const urlWithParams = params
      ? `${fullUrl}?${new URLSearchParams(params).toString()}`
      : fullUrl;

    const makeRequest = async (): Promise<Response> => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), this.readTimeout);

      try {
        const headers: Record<string, string> = {
          authtoken: this.tokens.idToken,
        };
        if (data) {
          headers["Content-Type"] = "application/json";
        }
        const response = await fetch(urlWithParams, {
          method,
          headers,
          body: data ? JSON.stringify(data) : undefined,
          signal: controller.signal,
        });
        return response;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          throw new TimeoutError(`Request timed out after ${this.readTimeout}ms`);
        }
        throw error;
      } finally {
        clearTimeout(timeout);
      }
    };

    // Retry logic with exponential backoff for 5xx errors
    const response = await exponentialBackoff(
      async () => {
        const resp = await makeRequest();

        // Handle 401 - refresh tokens and retry
        if (resp.status === 401) {
          await this.refreshTokens();
          return makeRequest();
        }

        // Throw on 5xx for retry logic
        if (resp.status >= 500) {
          throw new ApiError(`Server error: ${resp.status}`, resp.status);
        }

        return resp;
      },
      {
        maxAttempts: 5,
        initialDelay: 100,
        maxDelay: 5000,
        shouldRetry: (error) => {
          if (error instanceof ApiError && error.statusCode >= 500) {
            return true;
          }
          return false;
        },
      }
    );

    if (!response.ok) {
      throw new ApiError(
        `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
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

  setTokenUpdater(callback: (tokens: AuthTokens) => void): void {
    this.tokenUpdater = callback;
  }

  private extractTokensFromSession(session: CognitoUserSession): void {
    this.tokens = {
      idToken: session.getIdToken().getJwtToken(),
      accessToken: session.getAccessToken().getJwtToken(),
      refreshToken: session.getRefreshToken().getToken(),
    };
  }
}
