import type { VehicleApiResponse, VehicleStatusApiResponse } from "../types/api-responses";
export declare class Vehicle {
    vehicleGid: number;
    vendor: string;
    apiId: string;
    displayName: string;
    loadGid?: number;
    make?: string;
    model?: string;
    year?: number;
    static fromApiResponse(data: VehicleApiResponse): Vehicle;
}
export declare class VehicleStatus {
    vehicleState?: string;
    chargingState?: string;
    batteryLevel?: number;
    batteryRange?: number;
    chargeLimitPercent?: number;
    minutesToFullCharge?: number;
    chargeCurrentRequest?: number;
    chargeCurrentRequestMax?: number;
    static fromApiResponse(data: VehicleStatusApiResponse): VehicleStatus;
}
//# sourceMappingURL=vehicle.d.ts.map