import type { AuthProvider, AuthTokens } from "./auth";
import { CognitoAuth, SimulatedAuth } from "./auth";
import {
  API_ENDPOINTS,
  MAINTENANCE_URL,
  DEFAULT_CONNECT_TIMEOUT,
  DEFAULT_READ_TIMEOUT,
  DEFAULT_MAX_RETRY_ATTEMPTS,
  DEFAULT_INITIAL_RETRY_DELAY,
  DEFAULT_MAX_RETRY_DELAY,
} from "./constants";
import { formatDateToUtc } from "./utils/date";
import { sleep } from "./utils/retry";
import { Scale, Unit } from "./types/enums";
import type {
  EmporiaVueConfig,
  LoginOptions,
  RetryOptions,
  TokenStorage,
  TokenStorageProvider,
} from "./types/config";
import { FileTokenStorage } from "./storage/file";
import type {
  DeviceApiResponse,
  LocationPropertiesApiResponse,
  DeviceListUsagesApiResponse,
  ChartUsageApiResponse,
  DevicesStatusApiResponse,
  VehicleApiResponse,
  VehicleStatusApiResponse,
  CustomerApiResponse,
  ChannelTypeApiResponse,
  MaintenanceApiResponse,
  OutletApiResponse,
  ChargerApiResponse,
} from "./types/api-responses";

import { VueDevice, VueDeviceChannel } from "./models/device";
import { VueUsageDevice } from "./models/usage";
import { OutletDevice } from "./models/outlet";
import { ChargerDevice } from "./models/charger";
import { Vehicle, VehicleStatus } from "./models/vehicle";
import { Customer } from "./models/customer";
import { ChannelType } from "./models/channel-type";

export class EmporiaVue {
  private auth: AuthProvider;
  private connectTimeout: number;
  private readTimeout: number;
  private tokenStorage?: TokenStorageProvider;

  constructor(config: EmporiaVueConfig = {}) {
    this.connectTimeout = config.connectTimeout ?? DEFAULT_CONNECT_TIMEOUT;
    this.readTimeout = config.readTimeout ?? DEFAULT_READ_TIMEOUT;
    this.auth = new CognitoAuth(this.connectTimeout, this.readTimeout);
  }

  // ============ Authentication ============

  async login(options: LoginOptions): Promise<boolean> {
    const {
      username,
      password,
      idToken,
      accessToken,
      refreshToken,
      tokenStorageFile,
      tokenStorage,
    } = options;

    // Set up token storage (prefer new interface, support legacy)
    if (tokenStorage) {
      this.tokenStorage = tokenStorage;
    } else if (tokenStorageFile) {
      this.tokenStorage = new FileTokenStorage(tokenStorageFile);
    }

    // Try token storage first
    if (this.tokenStorage) {
      try {
        const stored = await this.tokenStorage.load();
        if (stored) {
          await this.auth.loginWithTokens({
            idToken: stored.idToken,
            accessToken: stored.accessToken,
            refreshToken: stored.refreshToken,
          });
          this.auth.setTokenUpdater((tokens) =>
            this.saveTokens(tokens, username)
          );
          return true;
        }
      } catch {
        // Continue to other auth methods
      }
    }

    // Try provided tokens
    if (idToken || accessToken || refreshToken) {
      await this.auth.loginWithTokens({ idToken, accessToken, refreshToken });
      if (this.tokenStorage) {
        this.auth.setTokenUpdater((tokens) =>
          this.saveTokens(tokens, username)
        );
      }
      return true;
    }

    // Username/password auth
    if (username && password) {
      await this.auth.login(username, password);
      if (this.tokenStorage) {
        await this.saveTokens(this.auth.getTokens(), username);
        this.auth.setTokenUpdater((tokens) =>
          this.saveTokens(tokens, username)
        );
      }
      return true;
    }

    return false;
  }

  async loginSimulator(
    host: string,
    username?: string,
    password?: string
  ): Promise<boolean> {
    this.auth = new SimulatedAuth(host);
    if (username && password) {
      await this.auth.login(username, password);
    }
    return true;
  }

  // ============ Device Methods ============

  async getDevices(): Promise<VueDevice[]> {
    const response = await this.auth.request<{ devices: DeviceApiResponse[] }>(
      "GET",
      API_ENDPOINTS.CUSTOMERS_DEVICES
    );

    const devices: VueDevice[] = [];
    for (const deviceData of response.devices ?? []) {
      devices.push(VueDevice.fromApiResponse(deviceData));
      // Handle nested devices (like Python does)
      if (deviceData.devices) {
        for (const subdev of deviceData.devices) {
          devices.push(VueDevice.fromApiResponse(subdev));
        }
      }
    }

    return devices;
  }

  async populateDeviceProperties(device: VueDevice): Promise<VueDevice> {
    const response = await this.auth.request<LocationPropertiesApiResponse>(
      "GET",
      API_ENDPOINTS.LOCATION_PROPERTIES(device.deviceGid)
    );
    device.populateLocationProperties(response);
    return device;
  }

  async getDevicesStatus(
    deviceList?: VueDevice[]
  ): Promise<{ outlets: OutletDevice[]; chargers: ChargerDevice[] }> {
    const devices = deviceList ?? (await this.getDevices());
    const deviceGids = devices.map((d) => d.deviceGid);

    const response = await this.auth.request<DevicesStatusApiResponse>(
      "GET",
      API_ENDPOINTS.DEVICE_STATUS,
      undefined,
      {
        deviceGids: deviceGids.join(","),
      }
    );

    return {
      outlets: (response.outlets ?? []).map((o) =>
        OutletDevice.fromApiResponse(o)
      ),
      chargers: (response.evChargers ?? []).map((c) =>
        ChargerDevice.fromApiResponse(c)
      ),
    };
  }

  // ============ Usage Methods ============

  async getDeviceListUsage(
    deviceGids: number[],
    instant: Date,
    scale: Scale = Scale.SECOND,
    unit: Unit = Unit.KWH,
    retryOptions: RetryOptions = {}
  ): Promise<Map<number, VueUsageDevice>> {
    const {
      maxRetryAttempts = DEFAULT_MAX_RETRY_ATTEMPTS,
      initialRetryDelay = DEFAULT_INITIAL_RETRY_DELAY,
      maxRetryDelay = DEFAULT_MAX_RETRY_DELAY,
    } = retryOptions;

    const params = {
      apiMethod: "getDeviceListUsages",
      deviceGids: deviceGids.join("+"),
      instant: formatDateToUtc(instant),
      scale: scale,
      energyUnit: unit,
    };

    let usageMap: Map<number, VueUsageDevice> = new Map();
    let delay = initialRetryDelay;

    for (let attempt = 0; attempt < maxRetryAttempts; attempt++) {
      const response = await this.auth.request<DeviceListUsagesApiResponse>(
        "GET",
        API_ENDPOINTS.APP_API,
        undefined,
        params
      );
      usageMap = new Map();

      const deviceUsages = response.deviceListUsages?.devices ?? [];
      for (const deviceData of deviceUsages) {
        const usageDevice = VueUsageDevice.fromApiResponse(deviceData);
        usageMap.set(usageDevice.deviceGid, usageDevice);
      }

      // Check if all requested devices have complete data
      const allComplete = deviceGids.every((gid) => {
        const device = usageMap.get(gid);
        if (!device) return false;
        // Check that at least one channel has non-null usage
        for (const [, channelUsage] of device.channelUsages) {
          if (channelUsage.usage !== null && channelUsage.usage !== undefined) {
            return true;
          }
        }
        return device.channelUsages.size === 0; // Allow devices with no channels
      });

      if (allComplete) {
        return usageMap;
      }

      // Retry with backoff
      await sleep(delay);
      delay = Math.min(delay * 2, maxRetryDelay);
    }

    return usageMap;
  }

  async getChartUsage(
    channel: VueDeviceChannel,
    start: Date,
    end: Date,
    scale: Scale = Scale.HOUR,
    unit: Unit = Unit.KWH
  ): Promise<{ usages: (number | null)[]; firstUsageTime: Date | null }> {
    const params = {
      apiMethod: "getChartUsage",
      deviceGid: String(channel.deviceGid),
      channel: channel.channelNum,
      start: formatDateToUtc(start),
      end: formatDateToUtc(end),
      scale: scale,
      energyUnit: unit,
    };

    const response = await this.auth.request<ChartUsageApiResponse>(
      "GET",
      API_ENDPOINTS.APP_API,
      undefined,
      params
    );

    return {
      usages: response.usageList ?? [],
      firstUsageTime: response.firstUsageInstant
        ? new Date(response.firstUsageInstant)
        : null,
    };
  }

  // ============ Device Control ============

  async updateOutlet(outlet: OutletDevice, on?: boolean): Promise<OutletDevice> {
    if (on !== undefined) {
      outlet.outletOn = on;
    }

    const response = await this.auth.request<OutletApiResponse>(
      "PUT",
      API_ENDPOINTS.OUTLET,
      outlet.toApiPayload()
    );

    return OutletDevice.fromApiResponse(response);
  }

  async updateCharger(
    charger: ChargerDevice,
    on?: boolean,
    chargeRate?: number
  ): Promise<ChargerDevice> {
    if (on !== undefined) {
      charger.chargerOn = on;
    }
    if (chargeRate !== undefined) {
      charger.chargingRate = chargeRate;
    }

    const response = await this.auth.request<ChargerApiResponse>(
      "PUT",
      API_ENDPOINTS.CHARGER,
      charger.toApiPayload()
    );

    return ChargerDevice.fromApiResponse(response);
  }

  async updateChannel(channel: VueDeviceChannel): Promise<VueDeviceChannel> {
    const response = await this.auth.request<unknown[]>(
      "PUT",
      API_ENDPOINTS.DEVICE_CHANNELS(channel.deviceGid),
      [channel.toApiPayload()]
    );

    if (response && response.length > 0) {
      return VueDeviceChannel.fromApiResponse(
        response[0] as Parameters<typeof VueDeviceChannel.fromApiResponse>[0]
      );
    }
    return channel;
  }

  // ============ Vehicle Methods ============

  async getVehicles(): Promise<Vehicle[]> {
    const response = await this.auth.request<VehicleApiResponse[]>(
      "GET",
      API_ENDPOINTS.CUSTOMERS_VEHICLES
    );

    return (response ?? []).map((v) => Vehicle.fromApiResponse(v));
  }

  async getVehicleStatus(vehicleGid: number): Promise<VehicleStatus | null> {
    try {
      const response = await this.auth.request<VehicleStatusApiResponse>(
        "GET",
        API_ENDPOINTS.VEHICLE_STATUS(vehicleGid)
      );
      return VehicleStatus.fromApiResponse(response);
    } catch {
      return null;
    }
  }

  // ============ Customer Methods ============

  async getCustomerDetails(): Promise<Customer | null> {
    try {
      const response = await this.auth.request<CustomerApiResponse>(
        "GET",
        API_ENDPOINTS.CUSTOMERS
      );
      return Customer.fromApiResponse(response);
    } catch {
      return null;
    }
  }

  // ============ Utility Methods ============

  async getChannelTypes(): Promise<ChannelType[]> {
    const response = await this.auth.request<ChannelTypeApiResponse[]>(
      "GET",
      API_ENDPOINTS.CHANNEL_TYPES
    );

    return (response ?? []).map((ct) => ChannelType.fromApiResponse(ct));
  }

  async downForMaintenance(): Promise<string | null> {
    try {
      const response = await this.auth.request<MaintenanceApiResponse>(
        "GET",
        MAINTENANCE_URL
      );
      return response.status ?? null;
    } catch {
      return null;
    }
  }

  /** @deprecated Use getDevicesStatus instead */
  async getOutlets(): Promise<OutletDevice[]> {
    const { outlets } = await this.getDevicesStatus();
    return outlets;
  }

  /** @deprecated Use getDevicesStatus instead */
  async getChargers(): Promise<ChargerDevice[]> {
    const { chargers } = await this.getDevicesStatus();
    return chargers;
  }

  // ============ Token Storage ============

  private async saveTokens(
    tokens: AuthTokens,
    username?: string
  ): Promise<void> {
    if (!this.tokenStorage) return;
    await this.tokenStorage.save({
      username: username ?? "",
      idToken: tokens.idToken,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }
}
