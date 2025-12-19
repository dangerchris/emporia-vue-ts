export interface DeviceApiResponse {
  deviceGid: number;
  manufacturerDeviceId?: string;
  model?: string;
  firmware?: string;
  parentDeviceGid?: number;
  parentChannelNum?: string;
  channels?: ChannelApiResponse[];
  devices?: DeviceApiResponse[];
  outlet?: OutletApiResponse;
  evCharger?: ChargerApiResponse;
  connected?: boolean;
  offlineSince?: string;
  locationProperties?: LocationPropertiesApiResponse;
}

export interface ChannelApiResponse {
  deviceGid: number;
  name?: string;
  channelNum?: string;
  channelMultiplier?: number;
  channelTypeGid?: number;
  type?: string;
  parentChannelNum?: string;
}

export interface UsageDeviceApiResponse {
  deviceGid: number;
  timestamp?: string;
  channelUsages?: ChannelUsageApiResponse[];
}

export interface ChannelUsageApiResponse extends ChannelApiResponse {
  usage?: number | null;
  percentage?: number;
  nestedDevices?: UsageDeviceApiResponse[];
}

export interface OutletApiResponse {
  deviceGid: number;
  outletOn?: boolean;
  loadGid?: number;
}

export interface ChargerApiResponse {
  deviceGid: number;
  chargerOn?: boolean;
  chargingRate?: number;
  maxChargingRate?: number;
  loadGid?: number;
  message?: string;
  status?: string;
  icon?: string;
  iconLabel?: string;
  iconDetailText?: string;
  faultText?: string;
  offPeakSchedulesEnabled?: boolean;
  breakerPin?: string;
  debugCode?: string;
  proControlCode?: string;
}

export interface VehicleApiResponse {
  vehicleGid: number;
  vendor?: string;
  apiId?: string;
  displayName?: string;
  loadGid?: number;
  make?: string;
  model?: string;
  year?: number;
}

export interface VehicleStatusApiResponse {
  vehicleState?: string;
  chargingState?: string;
  batteryLevel?: number;
  batteryRange?: number;
  chargeLimitPercent?: number;
  minutesToFullCharge?: number;
  chargeCurrentRequest?: number;
  chargeCurrentRequestMax?: number;
}

export interface CustomerApiResponse {
  customerGid: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  createdAt?: string;
}

export interface LocationPropertiesApiResponse {
  deviceGid: number;
  deviceName?: string;
  zipCode?: string;
  timeZone?: string;
  usageCentPerKwHour?: number;
  peakDemandDollarPerKw?: number;
  billingCycleStartDay?: number;
  utilityRateGid?: string;
  solar?: boolean;
  airConditioning?: string;
  heatSource?: string;
  locationSqFt?: number;
  numElectricCars?: string;
  numPeople?: string;
  swimmingPool?: boolean;
  hotTub?: boolean;
  latitudeLongitude?: { latitude: number; longitude: number };
  locationType?: string;
}

export interface ChannelTypeApiResponse {
  channelTypeGid: number;
  description?: string;
  selectable?: boolean;
}

export interface DeviceListUsagesApiResponse {
  deviceListUsages?: {
    instant?: string;
    scale?: string;
    energyUnit?: string;
    devices?: UsageDeviceApiResponse[];
  };
}

export interface ChartUsageApiResponse {
  usageList?: (number | null)[];
  firstUsageInstant?: string;
}

export interface DevicesStatusApiResponse {
  outlets?: OutletApiResponse[];
  evChargers?: ChargerApiResponse[];
  devicesConnected?: {
    deviceGid: number;
    connected: boolean;
    offlineSince?: string;
  }[];
}

export interface MaintenanceApiResponse {
  status?: string;
}
