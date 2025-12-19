import type {
  DeviceApiResponse,
  ChannelApiResponse,
  LocationPropertiesApiResponse,
} from "../types/api-responses";
import { OutletDevice } from "./outlet";
import { ChargerDevice } from "./charger";

export class VueDeviceChannel {
  deviceGid: number = 0;
  name: string = "";
  channelNum: string = "1,2,3";
  channelMultiplier: number = 1.0;
  channelTypeGid?: number;
  type?: string;
  parentChannelNum?: string;

  static fromApiResponse(data: ChannelApiResponse): VueDeviceChannel {
    const channel = new VueDeviceChannel();
    channel.deviceGid = data.deviceGid;
    channel.name = data.name ?? "";
    channel.channelNum = data.channelNum ?? "1,2,3";
    channel.channelMultiplier = data.channelMultiplier ?? 1.0;
    channel.channelTypeGid = data.channelTypeGid;
    channel.type = data.type;
    channel.parentChannelNum = data.parentChannelNum;
    return channel;
  }

  toApiPayload(): Record<string, unknown> {
    return {
      deviceGid: this.deviceGid,
      name: this.name,
      channelNum: this.channelNum,
      channelMultiplier: this.channelMultiplier,
      channelTypeGid: this.channelTypeGid,
    };
  }
}

export class VueDevice {
  deviceGid: number = 0;
  manufacturerId: string = "";
  model: string = "";
  firmware: string = "";
  parentDeviceGid?: number;
  parentChannelNum?: string;
  channels: VueDeviceChannel[] = [];
  outlet?: OutletDevice;
  evCharger?: ChargerDevice;
  connected: boolean = false;
  offlineSince?: Date;

  // Location properties
  deviceName: string = "";
  displayName: string = "";
  zipCode: string = "";
  timeZone: string = "";
  latitude?: number;
  longitude?: number;
  usageCentPerKwHour?: number;
  peakDemandDollarPerKw?: number;
  billingCycleStartDay?: number;
  utilityRateGid?: string;
  solar: boolean = false;
  airConditioning?: string;
  heatSource?: string;
  locationSqFt?: number;
  numElectricCars?: string;
  locationType?: string;
  numPeople?: string;
  swimmingPool: boolean = false;
  hotTub: boolean = false;

  static fromApiResponse(data: DeviceApiResponse): VueDevice {
    const device = new VueDevice();
    device.deviceGid = data.deviceGid;
    device.manufacturerId = data.manufacturerDeviceId ?? "";
    device.model = data.model ?? "";
    device.firmware = data.firmware ?? "";
    device.parentDeviceGid = data.parentDeviceGid;
    device.parentChannelNum = data.parentChannelNum;
    device.connected = data.connected ?? false;

    if (data.offlineSince) {
      device.offlineSince = new Date(data.offlineSince);
    }

    if (data.channels) {
      device.channels = data.channels.map(VueDeviceChannel.fromApiResponse);
    }

    if (data.outlet) {
      device.outlet = OutletDevice.fromApiResponse(data.outlet);
    }

    if (data.evCharger) {
      device.evCharger = ChargerDevice.fromApiResponse(data.evCharger);
    }

    return device;
  }

  populateLocationProperties(data: LocationPropertiesApiResponse): void {
    this.deviceName = data.deviceName ?? "";
    this.displayName = data.deviceName ?? "";
    this.zipCode = data.zipCode ?? "";
    this.timeZone = data.timeZone ?? "";
    this.usageCentPerKwHour = data.usageCentPerKwHour;
    this.peakDemandDollarPerKw = data.peakDemandDollarPerKw;
    this.billingCycleStartDay = data.billingCycleStartDay;
    this.utilityRateGid = data.utilityRateGid;
    this.solar = data.solar ?? false;
    this.airConditioning = data.airConditioning;
    this.heatSource = data.heatSource;
    this.locationSqFt = data.locationSqFt;
    this.numElectricCars = data.numElectricCars;
    this.locationType = data.locationType;
    this.numPeople = data.numPeople;
    this.swimmingPool = data.swimmingPool ?? false;
    this.hotTub = data.hotTub ?? false;

    if (data.latitudeLongitude) {
      this.latitude = data.latitudeLongitude.latitude;
      this.longitude = data.latitudeLongitude.longitude;
    }
  }
}
