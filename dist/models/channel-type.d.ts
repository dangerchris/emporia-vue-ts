import type { ChannelTypeApiResponse } from "../types/api-responses";
export declare class ChannelType {
    channelTypeGid: number;
    description: string;
    selectable: boolean;
    static fromApiResponse(data: ChannelTypeApiResponse): ChannelType;
}
//# sourceMappingURL=channel-type.d.ts.map