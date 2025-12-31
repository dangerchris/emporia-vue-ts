# emporia-vue

A TypeScript client for the [Emporia Vue](https://www.emporiaenergy.com/) energy monitoring API.

This library is a TypeScript port of [PyEmVue](https://github.com/magico13/PyEmVue) by [@magico13](https://github.com/magico13). Full credit to the original project for reverse-engineering the Emporia API. This port was created with assistance from [Claude Code](https://claude.ai/claude-code).

## Installation

```bash
npm install github:dangerchris/emporia-vue-ts
```

## Requirements

- Node.js 18.0.0 or higher
- ESM only (no CommonJS support)

## Quick Start

```typescript
import { EmporiaVue, Scale, Unit } from "emporia-vue";

const vue = new EmporiaVue();

// Login with username/password
await vue.login({
  username: "your@email.com",
  password: "your-password",
});

// Get all devices
const devices = await vue.getDevices();

// Get usage data
const usage = await vue.getDeviceListUsage(
  devices.map((d) => d.deviceGid),
  new Date(),
  Scale.MINUTE,
  Unit.KWH
);

// Print usage for each device
for (const [deviceGid, device] of usage) {
  console.log(`Device ${deviceGid}:`);
  for (const [channelNum, channel] of device.channelUsages) {
    console.log(`  Channel ${channelNum}: ${channel.usage} kWh`);
  }
}
```

## Authentication

This library authenticates with Emporia's API using AWS Cognito. The Cognito User Pool ID and Client ID embedded in this library are Emporia's official public credentials, extracted from their mobile app. These are not secrets - they are required for any client to authenticate with the Emporia API and are the same credentials used by [PyEmVue](https://github.com/magico13/PyEmVue) and other community clients.

Your Emporia account credentials (username/password) are sent directly to AWS Cognito and are never transmitted to or stored by this library beyond the authentication flow.

## Token Storage

For persistent authentication, use a token storage provider. This saves tokens to disk so you don't need to re-authenticate on every run.

### File-based Storage (Node.js)

```typescript
import { EmporiaVue } from "emporia-vue";
import { FileTokenStorage } from "emporia-vue/storage";

const vue = new EmporiaVue();

await vue.login({
  username: "your@email.com",
  password: "your-password",
  tokenStorage: new FileTokenStorage("./tokens.json"),
});
```

### Memory Storage (Testing/Browsers)

```typescript
import { EmporiaVue, MemoryTokenStorage } from "emporia-vue";

const vue = new EmporiaVue();
const storage = new MemoryTokenStorage();

await vue.login({
  username: "your@email.com",
  password: "your-password",
  tokenStorage: storage,
});
```

### Custom Storage

Implement the `TokenStorageProvider` interface for custom backends (databases, localStorage, etc.):

```typescript
import type { TokenStorageProvider, TokenStorage } from "emporia-vue";

class LocalStorageTokenStorage implements TokenStorageProvider {
  constructor(private key: string = "emporia-tokens") {}

  async load(): Promise<TokenStorage | null> {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : null;
  }

  async save(tokens: TokenStorage): Promise<void> {
    localStorage.setItem(this.key, JSON.stringify(tokens));
  }

  async clear(): Promise<void> {
    localStorage.removeItem(this.key);
  }
}
```

## API Reference

### EmporiaVue

The main client class.

```typescript
const vue = new EmporiaVue({
  connectTimeout: 6030,  // Connection timeout in ms
  readTimeout: 10030,    // Read timeout in ms
});
```

#### Authentication

- `login(options)` - Authenticate with username/password or tokens
- `loginSimulator(host, username?, password?)` - Connect to a test simulator

#### Devices

- `getDevices()` - Get all Vue devices in your account
- `populateDeviceProperties(device)` - Load extended device/location properties
- `getDevicesStatus(deviceList?)` - Get status of outlets and chargers

#### Usage Data

- `getDeviceListUsage(deviceGids, instant, scale?, unit?, retryOptions?)` - Get energy usage for devices
- `getChartUsage(channel, start, end, scale?, unit?)` - Get historical usage for a channel

#### Device Control

- `updateOutlet(outlet, on?)` - Turn smart outlet on/off
- `updateCharger(charger, on?, chargeRate?)` - Control EV charger
- `updateChannel(channel)` - Update channel settings

#### Other

- `getVehicles()` - Get linked electric vehicles
- `getVehicleStatus(vehicleGid)` - Get EV battery/charging status
- `getCustomerDetails()` - Get account information
- `getChannelTypes()` - Get available channel types
- `downForMaintenance()` - Check if API is in maintenance mode

### Enums

```typescript
import { Scale, Unit } from "emporia-vue";

// Time scales for usage queries
Scale.SECOND   // Real-time (1 second)
Scale.MINUTE   // 1 minute
Scale.MINUTES_15
Scale.HOUR
Scale.DAY
Scale.WEEK
Scale.MONTH
Scale.YEAR

// Energy units
Unit.KWH           // Kilowatt-hours
Unit.DOLLARS       // Cost in dollars
Unit.AMPHOURS      // Amp-hours
Unit.TREES         // Trees planted equivalent
Unit.GALLONS_GAS   // Gallons of gas equivalent
Unit.GALLONS_WATER // Gallons of water equivalent
Unit.CARBON        // Carbon emissions
```

## Error Handling

The library throws typed errors for different failure scenarios:

```typescript
import {
  EmporiaVueError,
  AuthenticationError,
  ApiError,
  NetworkError,
  TimeoutError,
} from "emporia-vue";

try {
  await vue.login({ username: "user", password: "wrong" });
} catch (error) {
  if (error instanceof AuthenticationError) {
    console.log("Invalid credentials");
  } else if (error instanceof NetworkError) {
    console.log("Network issue:", error.message);
  } else if (error instanceof TimeoutError) {
    console.log("Request timed out");
  } else if (error instanceof ApiError) {
    console.log("API error:", error.statusCode, error.message);
  }
}
```

## Disclaimer

This library is an unofficial community project and is not affiliated with, endorsed by, or supported by Emporia Energy. It is provided AS-IS with no warranty of any kind. Use at your own risk.

The Emporia API is undocumented and may change at any time without notice, which could break this library. The authors are not responsible for any issues arising from the use of this software, including but not limited to service interruptions, data loss, or account-related problems.

## License

MIT
