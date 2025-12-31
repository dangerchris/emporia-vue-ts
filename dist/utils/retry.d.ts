export interface RetryConfig {
    maxAttempts?: number;
    initialDelay?: number;
    maxDelay?: number;
    shouldRetry?: (error: Error) => boolean;
}
export declare function exponentialBackoff<T>(fn: () => Promise<T>, config?: RetryConfig): Promise<T>;
export declare function sleep(ms: number): Promise<void>;
//# sourceMappingURL=retry.d.ts.map