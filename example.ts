#!/usr/bin/env bun

import { EmporiaVue, Scale, Unit } from "./src";
import type { VueDevice } from "./src";
import type { VueUsageDevice } from "./src/models/usage";

function printRecursive(
  usageMap: Map<number, VueUsageDevice>,
  info: Map<number, VueDevice>,
  depth: number = 0
): void {
  for (const [gid, device] of usageMap) {
    for (const [channelNum, channel] of device.channelUsages) {
      let name = channel.name;
      if (name === "Main") {
        name = info.get(gid)?.deviceName || name;
      }
      const indent = "-".repeat(depth);
      console.log(`${indent} ${gid} ${channelNum} ${name} ${channel.usage} kwh`);

      if (channel.nestedDevices.length > 0) {
        // Convert nested devices array to map for recursive call
        const nestedMap = new Map<number, VueUsageDevice>();
        for (const nested of channel.nestedDevices) {
          nestedMap.set(nested.deviceGid, nested);
        }
        printRecursive(nestedMap, info, depth + 1);
      }
    }
  }
}

async function main() {
  const vue = new EmporiaVue();

  // Login with credentials - update these or use token storage
  const loggedIn = await vue.login({
    username: process.env.EMPORIA_USERNAME,
    password: process.env.EMPORIA_PASSWORD,
    tokenStorageFile: "keys.json",
  });

  if (!loggedIn) {
    console.error("Failed to login. Set EMPORIA_USERNAME and EMPORIA_PASSWORD environment variables.");
    process.exit(1);
  }

  // Get all devices
  const devices = await vue.getDevices();


  // Collect unique device GIDs and build device info map
  const deviceGids: number[] = [];
  const deviceInfo = new Map<number, VueDevice>();

  for (const device of devices) {
    console.log(device)
    if (!deviceGids.includes(device.deviceGid)) {
      deviceGids.push(device.deviceGid);
      deviceInfo.set(device.deviceGid, device);
    } else {
      // Merge channels for duplicate device GIDs
      const existingDevice = deviceInfo.get(device.deviceGid);
      if (existingDevice) {
        existingDevice.channels.push(...device.channels);
      }
    }
  }

  // Populate device properties to get device names
  for (const device of deviceInfo.values()) {
    await vue.populateDeviceProperties(device);
  }

  // Get usage data
  const deviceUsageMap = await vue.getDeviceListUsage(
    deviceGids,
    new Date(),
    Scale.MINUTE,
    Unit.KWH
  );

  // Print results
  console.log("device_gid channel_num name usage unit");
  printRecursive(deviceUsageMap, deviceInfo);
}

main().catch(console.error);
