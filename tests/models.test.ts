import { describe, expect, test } from "bun:test";
import { VueDevice, VueDeviceChannel } from "../src/models/device";
import { VueUsageDevice, VueDeviceChannelUsage } from "../src/models/usage";
import { OutletDevice } from "../src/models/outlet";
import { ChargerDevice } from "../src/models/charger";
import { Vehicle, VehicleStatus } from "../src/models/vehicle";
import { Customer } from "../src/models/customer";
import { ChannelType } from "../src/models/channel-type";

describe("VueDevice", () => {
  test("fromApiResponse creates device correctly", () => {
    const data = {
      deviceGid: 12345,
      manufacturerDeviceId: "ABC123",
      model: "VUE001",
      firmware: "1.0.0",
      connected: true,
      channels: [
        {
          deviceGid: 12345,
          name: "Main",
          channelNum: "1,2,3",
          channelMultiplier: 1.0,
        },
      ],
    };

    const device = VueDevice.fromApiResponse(data);

    expect(device.deviceGid).toBe(12345);
    expect(device.manufacturerId).toBe("ABC123");
    expect(device.model).toBe("VUE001");
    expect(device.firmware).toBe("1.0.0");
    expect(device.connected).toBe(true);
    expect(device.channels).toHaveLength(1);
    expect(device.channels[0].name).toBe("Main");
  });

  test("populateLocationProperties populates correctly", () => {
    const device = new VueDevice();
    device.populateLocationProperties({
      deviceGid: 12345,
      deviceName: "Home",
      zipCode: "12345",
      timeZone: "America/New_York",
      solar: true,
      latitudeLongitude: { latitude: 40.7128, longitude: -74.006 },
    });

    expect(device.deviceName).toBe("Home");
    expect(device.zipCode).toBe("12345");
    expect(device.timeZone).toBe("America/New_York");
    expect(device.solar).toBe(true);
    expect(device.latitude).toBe(40.7128);
    expect(device.longitude).toBe(-74.006);
  });
});

describe("VueDeviceChannel", () => {
  test("fromApiResponse creates channel correctly", () => {
    const data = {
      deviceGid: 12345,
      name: "Main",
      channelNum: "1,2,3",
      channelMultiplier: 1.5,
      channelTypeGid: 1,
      type: "Main",
    };

    const channel = VueDeviceChannel.fromApiResponse(data);

    expect(channel.deviceGid).toBe(12345);
    expect(channel.name).toBe("Main");
    expect(channel.channelNum).toBe("1,2,3");
    expect(channel.channelMultiplier).toBe(1.5);
  });

  test("toApiPayload returns correct format", () => {
    const channel = new VueDeviceChannel();
    channel.deviceGid = 12345;
    channel.name = "Kitchen";
    channel.channelNum = "4";
    channel.channelMultiplier = 1.0;
    channel.channelTypeGid = 5;

    const payload = channel.toApiPayload();

    expect(payload).toEqual({
      deviceGid: 12345,
      name: "Kitchen",
      channelNum: "4",
      channelMultiplier: 1.0,
      channelTypeGid: 5,
    });
  });
});

describe("VueUsageDevice", () => {
  test("fromApiResponse creates usage device correctly", () => {
    const data = {
      deviceGid: 12345,
      timestamp: "2023-12-01T00:00:00Z",
      channelUsages: [
        {
          deviceGid: 12345,
          name: "Main",
          channelNum: "1,2,3",
          channelMultiplier: 1.0,
          usage: 10.5,
          percentage: 100,
        },
      ],
    };

    const usageDevice = VueUsageDevice.fromApiResponse(data);

    expect(usageDevice.deviceGid).toBe(12345);
    expect(usageDevice.timestamp).toEqual(new Date("2023-12-01T00:00:00Z"));
    expect(usageDevice.channelUsages.size).toBe(1);

    const channelUsage = usageDevice.channelUsages.get("1,2,3");
    expect(channelUsage?.usage).toBe(10.5);
    expect(channelUsage?.percentage).toBe(100);
  });
});

describe("OutletDevice", () => {
  test("fromApiResponse creates outlet correctly", () => {
    const data = {
      deviceGid: 12345,
      outletOn: true,
      loadGid: 1,
    };

    const outlet = OutletDevice.fromApiResponse(data);

    expect(outlet.deviceGid).toBe(12345);
    expect(outlet.outletOn).toBe(true);
    expect(outlet.loadGid).toBe(1);
  });

  test("toApiPayload returns correct format", () => {
    const outlet = new OutletDevice();
    outlet.deviceGid = 12345;
    outlet.outletOn = false;

    const payload = outlet.toApiPayload();

    expect(payload).toEqual({
      deviceGid: 12345,
      outletOn: false,
    });
  });
});

describe("ChargerDevice", () => {
  test("fromApiResponse creates charger correctly", () => {
    const data = {
      deviceGid: 12345,
      chargerOn: true,
      chargingRate: 32,
      maxChargingRate: 48,
      status: "charging",
      message: "Charging at 32A",
    };

    const charger = ChargerDevice.fromApiResponse(data);

    expect(charger.deviceGid).toBe(12345);
    expect(charger.chargerOn).toBe(true);
    expect(charger.chargingRate).toBe(32);
    expect(charger.maxChargingRate).toBe(48);
    expect(charger.status).toBe("charging");
    expect(charger.message).toBe("Charging at 32A");
  });

  test("toApiPayload returns correct format", () => {
    const charger = new ChargerDevice();
    charger.deviceGid = 12345;
    charger.chargerOn = true;
    charger.chargingRate = 24;
    charger.maxChargingRate = 48;
    charger.offPeakSchedulesEnabled = true;

    const payload = charger.toApiPayload();

    expect(payload).toEqual({
      deviceGid: 12345,
      chargerOn: true,
      chargingRate: 24,
      maxChargingRate: 48,
      offPeakSchedulesEnabled: true,
    });
  });
});

describe("Vehicle", () => {
  test("fromApiResponse creates vehicle correctly", () => {
    const data = {
      vehicleGid: 12345,
      vendor: "Tesla",
      displayName: "Model 3",
      make: "Tesla",
      model: "Model 3",
      year: 2023,
    };

    const vehicle = Vehicle.fromApiResponse(data);

    expect(vehicle.vehicleGid).toBe(12345);
    expect(vehicle.vendor).toBe("Tesla");
    expect(vehicle.displayName).toBe("Model 3");
    expect(vehicle.make).toBe("Tesla");
    expect(vehicle.model).toBe("Model 3");
    expect(vehicle.year).toBe(2023);
  });
});

describe("VehicleStatus", () => {
  test("fromApiResponse creates status correctly", () => {
    const data = {
      vehicleState: "online",
      chargingState: "Charging",
      batteryLevel: 75,
      batteryRange: 200.5,
      chargeLimitPercent: 80,
      minutesToFullCharge: 45,
    };

    const status = VehicleStatus.fromApiResponse(data);

    expect(status.vehicleState).toBe("online");
    expect(status.chargingState).toBe("Charging");
    expect(status.batteryLevel).toBe(75);
    expect(status.batteryRange).toBe(200.5);
    expect(status.chargeLimitPercent).toBe(80);
    expect(status.minutesToFullCharge).toBe(45);
  });
});

describe("Customer", () => {
  test("fromApiResponse creates customer correctly", () => {
    const data = {
      customerGid: 12345,
      email: "test@example.com",
      firstName: "John",
      lastName: "Doe",
      createdAt: "2023-01-15T10:30:00Z",
    };

    const customer = Customer.fromApiResponse(data);

    expect(customer.customerGid).toBe(12345);
    expect(customer.email).toBe("test@example.com");
    expect(customer.firstName).toBe("John");
    expect(customer.lastName).toBe("Doe");
    expect(customer.createdAt).toEqual(new Date("2023-01-15T10:30:00Z"));
  });
});

describe("ChannelType", () => {
  test("fromApiResponse creates channel type correctly", () => {
    const data = {
      channelTypeGid: 1,
      description: "Main Panel",
      selectable: true,
    };

    const channelType = ChannelType.fromApiResponse(data);

    expect(channelType.channelTypeGid).toBe(1);
    expect(channelType.description).toBe("Main Panel");
    expect(channelType.selectable).toBe(true);
  });
});
