export const COGNITO_USER_POOL_ID = "us-east-2_ghlOXVLi1";
export const COGNITO_CLIENT_ID = "4qte47jbstod8apnfic0bunmrq";
export const COGNITO_REGION = "us-east-2";

export const API_BASE_URL = "https://api.emporiaenergy.com";
export const MAINTENANCE_URL =
  "https://s3.amazonaws.com/com.emporiaenergy.manual.ota/maintenance/maintenance.json";

export const API_ENDPOINTS = {
  CUSTOMERS: "/customers",
  CUSTOMERS_DEVICES: "/customers/devices",
  CUSTOMERS_VEHICLES: "/customers/vehicles",
  APP_API: "/AppAPI",
  DEVICE_CHANNELS: (deviceGid: number) => `/devices/${deviceGid}/channels`,
  CHANNEL_TYPES: "/devices/channels/channeltypes",
  LOCATION_PROPERTIES: (deviceGid: number) =>
    `/devices/${deviceGid}/locationProperties`,
  DEVICE_STATUS: "/customers/devices/status",
  OUTLET: "/devices/outlet",
  CHARGER: "/devices/evcharger",
  VEHICLE_STATUS: (vehicleGid: number) =>
    `/vehicles/v2/settings?vehicleGid=${vehicleGid}`,
} as const;

export const DEFAULT_CONNECT_TIMEOUT = 6030;
export const DEFAULT_READ_TIMEOUT = 10030;
export const DEFAULT_MAX_RETRY_ATTEMPTS = 5;
export const DEFAULT_INITIAL_RETRY_DELAY = 100;
export const DEFAULT_MAX_RETRY_DELAY = 5000;
