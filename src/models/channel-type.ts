import type { ChannelTypeApiResponse } from "../types/api-responses";

export class ChannelType {
  channelTypeGid: number = 0;
  description: string = "";
  selectable: boolean = false;

  static fromApiResponse(data: ChannelTypeApiResponse): ChannelType {
    const channelType = new ChannelType();
    channelType.channelTypeGid = data.channelTypeGid;
    channelType.description = data.description ?? "";
    channelType.selectable = data.selectable ?? false;
    return channelType;
  }
}
