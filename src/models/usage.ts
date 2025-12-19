import type {
  UsageDeviceApiResponse,
  ChannelUsageApiResponse,
} from "../types/api-responses";
import { VueDevice, VueDeviceChannel } from "./device";

export class VueDeviceChannelUsage extends VueDeviceChannel {
  usage?: number | null;
  percentage?: number;
  timestamp?: Date;
  nestedDevices: VueUsageDevice[] = [];

  static fromApiResponse(data: ChannelUsageApiResponse): VueDeviceChannelUsage {
    const usage = new VueDeviceChannelUsage();
    usage.deviceGid = data.deviceGid;
    usage.name = data.name ?? "";
    usage.channelNum = data.channelNum ?? "1,2,3";
    usage.channelMultiplier = data.channelMultiplier ?? 1.0;
    usage.channelTypeGid = data.channelTypeGid;
    usage.type = data.type;
    usage.parentChannelNum = data.parentChannelNum;
    usage.usage = data.usage;
    usage.percentage = data.percentage;

    if (data.nestedDevices) {
      usage.nestedDevices = data.nestedDevices.map(
        VueUsageDevice.fromApiResponse
      );
    }

    return usage;
  }
}

export class VueUsageDevice extends VueDevice {
  timestamp?: Date;
  channelUsages: Map<string, VueDeviceChannelUsage> = new Map();

  static fromApiResponse(data: UsageDeviceApiResponse): VueUsageDevice {
    const device = new VueUsageDevice();
    device.deviceGid = data.deviceGid;

    if (data.timestamp) {
      device.timestamp = new Date(data.timestamp);
    }

    if (data.channelUsages) {
      for (const channelData of data.channelUsages) {
        const channelUsage = VueDeviceChannelUsage.fromApiResponse(channelData);
        device.channelUsages.set(channelUsage.channelNum, channelUsage);
      }
    }

    return device;
  }
}
