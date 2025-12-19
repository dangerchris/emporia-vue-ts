import type { ChargerApiResponse } from "../types/api-responses";

export class ChargerDevice {
  deviceGid: number = 0;
  chargerOn: boolean = false;
  chargingRate: number = 0;
  maxChargingRate: number = 0;
  loadGid?: number;
  message?: string;
  status?: string;
  icon?: string;
  iconLabel?: string;
  iconDetailText?: string;
  faultText?: string;
  offPeakSchedulesEnabled: boolean = false;
  breakerPin?: string;
  debugCode?: string;
  proControlCode?: string;

  static fromApiResponse(data: ChargerApiResponse): ChargerDevice {
    const charger = new ChargerDevice();
    charger.deviceGid = data.deviceGid;
    charger.chargerOn = data.chargerOn ?? false;
    charger.chargingRate = data.chargingRate ?? 0;
    charger.maxChargingRate = data.maxChargingRate ?? 0;
    charger.loadGid = data.loadGid;
    charger.message = data.message;
    charger.status = data.status;
    charger.icon = data.icon;
    charger.iconLabel = data.iconLabel;
    charger.iconDetailText = data.iconDetailText;
    charger.faultText = data.faultText;
    charger.offPeakSchedulesEnabled = data.offPeakSchedulesEnabled ?? false;
    charger.breakerPin = data.breakerPin;
    charger.debugCode = data.debugCode;
    charger.proControlCode = data.proControlCode;
    return charger;
  }

  toApiPayload(): Record<string, unknown> {
    return {
      deviceGid: this.deviceGid,
      chargerOn: this.chargerOn,
      chargingRate: this.chargingRate,
      maxChargingRate: this.maxChargingRate,
      offPeakSchedulesEnabled: this.offPeakSchedulesEnabled,
    };
  }
}
