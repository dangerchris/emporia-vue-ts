import type { UsageDeviceApiResponse, ChannelUsageApiResponse } from "../types/api-responses";
import { VueDevice, VueDeviceChannel } from "./device";
export declare class VueDeviceChannelUsage extends VueDeviceChannel {
    usage?: number | null;
    percentage?: number;
    timestamp?: Date;
    nestedDevices: VueUsageDevice[];
    static fromApiResponse(data: ChannelUsageApiResponse): VueDeviceChannelUsage;
}
export declare class VueUsageDevice extends VueDevice {
    timestamp?: Date;
    channelUsages: Map<string, VueDeviceChannelUsage>;
    static fromApiResponse(data: UsageDeviceApiResponse): VueUsageDevice;
}
//# sourceMappingURL=usage.d.ts.map