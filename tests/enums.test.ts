import { describe, expect, test } from "bun:test";
import { Scale, Unit } from "../src/types/enums";

describe("Scale enum", () => {
  test("has correct values", () => {
    expect(Scale.SECOND).toBe("1S");
    expect(Scale.MINUTE).toBe("1MIN");
    expect(Scale.MINUTES_15).toBe("15MIN");
    expect(Scale.HOUR).toBe("1H");
    expect(Scale.DAY).toBe("1D");
    expect(Scale.WEEK).toBe("1W");
    expect(Scale.MONTH).toBe("1MON");
    expect(Scale.YEAR).toBe("1Y");
  });
});

describe("Unit enum", () => {
  test("has correct values", () => {
    expect(Unit.VOLTS).toBe("Voltage");
    expect(Unit.KWH).toBe("KilowattHours");
    expect(Unit.USD).toBe("Dollars");
    expect(Unit.AMPHOURS).toBe("AmpHours");
    expect(Unit.TREES).toBe("Trees");
    expect(Unit.GAS).toBe("GallonsOfGas");
    expect(Unit.DRIVEN).toBe("MilesDriven");
    expect(Unit.CARBON).toBe("Carbon");
  });
});
