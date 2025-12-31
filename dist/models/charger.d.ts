import type { ChargerApiResponse } from "../types/api-responses";
export declare class ChargerDevice {
    deviceGid: number;
    chargerOn: boolean;
    chargingRate: number;
    maxChargingRate: number;
    loadGid?: number;
    message?: string;
    status?: string;
    icon?: string;
    iconLabel?: string;
    iconDetailText?: string;
    faultText?: string;
    offPeakSchedulesEnabled: boolean;
    breakerPin?: string;
    debugCode?: string;
    proControlCode?: string;
    static fromApiResponse(data: ChargerApiResponse): ChargerDevice;
    toApiPayload(): Record<string, unknown>;
}
//# sourceMappingURL=charger.d.ts.map