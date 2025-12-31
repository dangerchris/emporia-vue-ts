export declare class EmporiaVueError extends Error {
    constructor(message: string);
}
export declare class AuthenticationError extends EmporiaVueError {
    constructor(message: string);
}
export declare class ApiError extends EmporiaVueError {
    statusCode: number;
    constructor(message: string, statusCode: number);
}
export declare class NetworkError extends EmporiaVueError {
    constructor(message: string);
}
export declare class TimeoutError extends EmporiaVueError {
    constructor(message: string);
}
//# sourceMappingURL=errors.d.ts.map