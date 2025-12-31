import { Scale, Unit } from "./types/enums";
import type { EmporiaVueConfig, LoginOptions, RetryOptions } from "./types/config";
import { VueDevice, VueDeviceChannel } from "./models/device";
import { VueUsageDevice } from "./models/usage";
import { OutletDevice } from "./models/outlet";
import { ChargerDevice } from "./models/charger";
import { Vehicle, VehicleStatus } from "./models/vehicle";
import { Customer } from "./models/customer";
import { ChannelType } from "./models/channel-type";
/**
 * Client for interacting with the Emporia Vue energy monitoring API.
 *
 * @example
 * ```typescript
 * const vue = new EmporiaVue();
 * await vue.login({ username: "user@example.com", password: "password" });
 * const devices = await vue.getDevices();
 * ```
 */
export declare class EmporiaVue {
    private auth;
    private connectTimeout;
    private readTimeout;
    private tokenStorage?;
    /**
     * Creates a new EmporiaVue client instance.
     * @param config - Optional configuration for timeouts
     */
    constructor(config?: EmporiaVueConfig);
    /**
     * Authenticates with the Emporia API using username/password or existing tokens.
     * Supports persistent token storage to avoid re-authentication on subsequent runs.
     *
     * @param options - Login options including credentials and optional token storage
     * @returns `true` if authentication succeeded, `false` if no valid credentials provided
     * @throws {AuthenticationError} If credentials are invalid or authentication fails
     *
     * @example
     * ```typescript
     * // With username/password
     * await vue.login({ username: "user@example.com", password: "password" });
     *
     * // With persistent token storage
     * await vue.login({
     *   username: "user@example.com",
     *   password: "password",
     *   tokenStorage: new FileTokenStorage("./tokens.json"),
     * });
     * ```
     */
    login(options: LoginOptions): Promise<boolean>;
    /**
     * Connects to a test/simulator server instead of the production Emporia API.
     * Useful for development and testing without hitting the real API.
     *
     * @param host - The simulator server host URL
     * @param username - Optional username for simulator authentication
     * @param password - Optional password for simulator authentication
     * @returns `true` when connected
     */
    loginSimulator(host: string, username?: string, password?: string): Promise<boolean>;
    /**
     * Retrieves all Vue devices associated with the authenticated account.
     * Includes nested/child devices (e.g., smart plugs connected to a Vue monitor).
     *
     * @returns Array of VueDevice objects
     * @throws {AuthenticationError} If not authenticated
     * @throws {ApiError} If the API request fails
     */
    getDevices(): Promise<VueDevice[]>;
    /**
     * Loads extended location properties for a device (address, timezone, etc.).
     * Mutates the device object in place and returns it.
     *
     * @param device - The device to populate with location properties
     * @returns The same device object with location properties populated
     * @throws {ApiError} If the API request fails
     */
    populateDeviceProperties(device: VueDevice): Promise<VueDevice>;
    /**
     * Gets the current status of smart outlets and EV chargers.
     *
     * @param deviceList - Optional list of devices to check. If not provided, fetches all devices first.
     * @returns Object containing arrays of outlet and charger status
     * @throws {ApiError} If the API request fails
     */
    getDevicesStatus(deviceList?: VueDevice[]): Promise<{
        outlets: OutletDevice[];
        chargers: ChargerDevice[];
    }>;
    /**
     * Gets energy usage data for multiple devices at a specific instant in time.
     * Automatically retries if usage data is not yet available.
     *
     * @param deviceGids - Array of device GIDs to get usage for
     * @param instant - The point in time to get usage data for
     * @param scale - Time scale for the usage data (default: SECOND)
     * @param unit - Energy unit for the usage data (default: KWH)
     * @param retryOptions - Optional retry configuration
     * @returns Map of device GID to usage data
     * @throws {ApiError} If the API request fails after all retries
     */
    getDeviceListUsage(deviceGids: number[], instant: Date, scale?: Scale, unit?: Unit, retryOptions?: RetryOptions): Promise<Map<number, VueUsageDevice>>;
    /**
     * Gets historical usage data for a specific channel over a time range.
     * Useful for generating charts and analyzing usage patterns.
     *
     * @param channel - The device channel to get usage for
     * @param start - Start of the time range
     * @param end - End of the time range
     * @param scale - Time scale for data points (default: HOUR)
     * @param unit - Energy unit for the usage data (default: KWH)
     * @returns Object with usage array and first usage timestamp
     * @throws {ApiError} If the API request fails
     */
    getChartUsage(channel: VueDeviceChannel, start: Date, end: Date, scale?: Scale, unit?: Unit): Promise<{
        usages: (number | null)[];
        firstUsageTime: Date | null;
    }>;
    /**
     * Updates a smart outlet's state (on/off).
     *
     * @param outlet - The outlet device to update
     * @param on - Optional new on/off state. If not provided, sends the outlet's current state.
     * @returns Updated outlet device with new state from API
     * @throws {ApiError} If the API request fails
     */
    updateOutlet(outlet: OutletDevice, on?: boolean): Promise<OutletDevice>;
    /**
     * Updates an EV charger's state and/or charging rate.
     *
     * @param charger - The charger device to update
     * @param on - Optional new on/off state
     * @param chargeRate - Optional new charging rate (amps)
     * @returns Updated charger device with new state from API
     * @throws {ApiError} If the API request fails
     */
    updateCharger(charger: ChargerDevice, on?: boolean, chargeRate?: number): Promise<ChargerDevice>;
    /**
     * Updates a device channel's settings (name, multiplier, type, etc.).
     *
     * @param channel - The channel with updated settings
     * @returns Updated channel from API response
     * @throws {ApiError} If the API request fails
     */
    updateChannel(channel: VueDeviceChannel): Promise<VueDeviceChannel>;
    /**
     * Gets all electric vehicles linked to the account.
     *
     * @returns Array of Vehicle objects
     * @throws {ApiError} If the API request fails
     */
    getVehicles(): Promise<Vehicle[]>;
    /**
     * Gets the current status of an electric vehicle (battery level, charging state, etc.).
     *
     * @param vehicleGid - The vehicle's GID
     * @returns VehicleStatus object or null if not available
     */
    getVehicleStatus(vehicleGid: number): Promise<VehicleStatus | null>;
    /**
     * Gets the authenticated customer's account details.
     *
     * @returns Customer object or null if not available
     */
    getCustomerDetails(): Promise<Customer | null>;
    /**
     * Gets the list of available channel types for device configuration.
     *
     * @returns Array of ChannelType objects
     * @throws {ApiError} If the API request fails
     */
    getChannelTypes(): Promise<ChannelType[]>;
    /**
     * Checks if the Emporia API is currently down for maintenance.
     *
     * @returns Maintenance status message or null if API is operational
     */
    downForMaintenance(): Promise<string | null>;
    /** @deprecated Use getDevicesStatus instead */
    getOutlets(): Promise<OutletDevice[]>;
    /** @deprecated Use getDevicesStatus instead */
    getChargers(): Promise<ChargerDevice[]>;
    private saveTokens;
}
//# sourceMappingURL=client.d.ts.map