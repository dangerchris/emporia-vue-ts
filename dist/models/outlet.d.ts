import type { OutletApiResponse } from "../types/api-responses";
export declare class OutletDevice {
    deviceGid: number;
    outletOn: boolean;
    loadGid: number;
    static fromApiResponse(data: OutletApiResponse): OutletDevice;
    toApiPayload(): Record<string, unknown>;
}
//# sourceMappingURL=outlet.d.ts.map