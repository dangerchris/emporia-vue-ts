export declare const COGNITO_USER_POOL_ID = "us-east-2_ghlOXVLi1";
export declare const COGNITO_CLIENT_ID = "4qte47jbstod8apnfic0bunmrq";
export declare const COGNITO_REGION = "us-east-2";
export declare const API_BASE_URL = "https://api.emporiaenergy.com";
export declare const MAINTENANCE_URL = "https://s3.amazonaws.com/com.emporiaenergy.manual.ota/maintenance/maintenance.json";
export declare const API_ENDPOINTS: {
    readonly CUSTOMERS: "/customers";
    readonly CUSTOMERS_DEVICES: "/customers/devices";
    readonly CUSTOMERS_VEHICLES: "/customers/vehicles";
    readonly APP_API: "/AppAPI";
    readonly DEVICE_CHANNELS: (deviceGid: number) => string;
    readonly CHANNEL_TYPES: "/devices/channels/channeltypes";
    readonly LOCATION_PROPERTIES: (deviceGid: number) => string;
    readonly DEVICE_STATUS: "/customers/devices/status";
    readonly OUTLET: "/devices/outlet";
    readonly CHARGER: "/devices/evcharger";
    readonly VEHICLE_STATUS: (vehicleGid: number) => string;
};
export declare const DEFAULT_CONNECT_TIMEOUT = 6030;
export declare const DEFAULT_READ_TIMEOUT = 10030;
export declare const DEFAULT_MAX_RETRY_ATTEMPTS = 5;
export declare const DEFAULT_INITIAL_RETRY_DELAY = 100;
export declare const DEFAULT_MAX_RETRY_DELAY = 5000;
//# sourceMappingURL=constants.d.ts.map