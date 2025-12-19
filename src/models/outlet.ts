import type { OutletApiResponse } from "../types/api-responses";

export class OutletDevice {
  deviceGid: number = 0;
  outletOn: boolean = false;
  loadGid: number = 0;

  static fromApiResponse(data: OutletApiResponse): OutletDevice {
    const outlet = new OutletDevice();
    outlet.deviceGid = data.deviceGid;
    outlet.outletOn = data.outletOn ?? false;
    outlet.loadGid = data.loadGid ?? 0;
    return outlet;
  }

  toApiPayload(): Record<string, unknown> {
    return {
      deviceGid: this.deviceGid,
      outletOn: this.outletOn,
    };
  }
}
