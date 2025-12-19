import type {
  VehicleApiResponse,
  VehicleStatusApiResponse,
} from "../types/api-responses";

export class Vehicle {
  vehicleGid: number = 0;
  vendor: string = "";
  apiId: string = "";
  displayName: string = "";
  loadGid?: number;
  make?: string;
  model?: string;
  year?: number;

  static fromApiResponse(data: VehicleApiResponse): Vehicle {
    const vehicle = new Vehicle();
    vehicle.vehicleGid = data.vehicleGid;
    vehicle.vendor = data.vendor ?? "";
    vehicle.apiId = data.apiId ?? "";
    vehicle.displayName = data.displayName ?? "";
    vehicle.loadGid = data.loadGid;
    vehicle.make = data.make;
    vehicle.model = data.model;
    vehicle.year = data.year;
    return vehicle;
  }
}

export class VehicleStatus {
  vehicleState?: string;
  chargingState?: string;
  batteryLevel?: number;
  batteryRange?: number;
  chargeLimitPercent?: number;
  minutesToFullCharge?: number;
  chargeCurrentRequest?: number;
  chargeCurrentRequestMax?: number;

  static fromApiResponse(data: VehicleStatusApiResponse): VehicleStatus {
    const status = new VehicleStatus();
    status.vehicleState = data.vehicleState;
    status.chargingState = data.chargingState;
    status.batteryLevel = data.batteryLevel;
    status.batteryRange = data.batteryRange;
    status.chargeLimitPercent = data.chargeLimitPercent;
    status.minutesToFullCharge = data.minutesToFullCharge;
    status.chargeCurrentRequest = data.chargeCurrentRequest;
    status.chargeCurrentRequestMax = data.chargeCurrentRequestMax;
    return status;
  }
}
