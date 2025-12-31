import type { DeviceApiResponse, ChannelApiResponse, LocationPropertiesApiResponse } from "../types/api-responses";
import { OutletDevice } from "./outlet";
import { ChargerDevice } from "./charger";
export declare class VueDeviceChannel {
    deviceGid: number;
    name: string;
    channelNum: string;
    channelMultiplier: number;
    channelTypeGid?: number;
    type?: string;
    parentChannelNum?: string;
    static fromApiResponse(data: ChannelApiResponse): VueDeviceChannel;
    toApiPayload(): Record<string, unknown>;
}
export declare class VueDevice {
    deviceGid: number;
    manufacturerId: string;
    model: string;
    firmware: string;
    parentDeviceGid?: number;
    parentChannelNum?: string;
    channels: VueDeviceChannel[];
    outlet?: OutletDevice;
    evCharger?: ChargerDevice;
    connected: boolean;
    offlineSince?: Date;
    deviceName: string;
    displayName: string;
    zipCode: string;
    timeZone: string;
    latitude?: number;
    longitude?: number;
    usageCentPerKwHour?: number;
    peakDemandDollarPerKw?: number;
    billingCycleStartDay?: number;
    utilityRateGid?: string;
    solar: boolean;
    airConditioning?: string;
    heatSource?: string;
    locationSqFt?: number;
    numElectricCars?: string;
    locationType?: string;
    numPeople?: string;
    swimmingPool: boolean;
    hotTub: boolean;
    static fromApiResponse(data: DeviceApiResponse): VueDevice;
    populateLocationProperties(data: LocationPropertiesApiResponse): void;
}
//# sourceMappingURL=device.d.ts.map