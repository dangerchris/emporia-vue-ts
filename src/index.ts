// Main client
export { EmporiaVue } from "./client";

// Enums
export { Scale, Unit } from "./types/enums";

// Config types
export type {
  EmporiaVueConfig,
  LoginOptions,
  RetryOptions,
  TokenStorage,
  TokenStorageProvider,
} from "./types/config";

// Storage providers (MemoryTokenStorage works everywhere)
// For FileTokenStorage, import from "emporia-vue/storage" to avoid bundling Node.js fs
export { MemoryTokenStorage } from "./storage/memory";

// Models
export { VueDevice, VueDeviceChannel } from "./models/device";
export { VueUsageDevice, VueDeviceChannelUsage } from "./models/usage";
export { OutletDevice } from "./models/outlet";
export { ChargerDevice } from "./models/charger";
export { Vehicle, VehicleStatus } from "./models/vehicle";
export { Customer } from "./models/customer";
export { ChannelType } from "./models/channel-type";

// Errors
export {
  EmporiaVueError,
  AuthenticationError,
  ApiError,
  NetworkError,
  TimeoutError,
} from "./errors";

// Auth (for advanced use cases)
export type { AuthProvider, AuthTokens } from "./auth";
export { CognitoAuth, SimulatedAuth } from "./auth";
