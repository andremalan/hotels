import { describe, it, expect } from "vitest";

import { categorizeFacilities } from "./categorizeFacilities";

describe("categorizeFacilities", () => {
  it("should categorize and normalize facilities correctly", () => {
    const facilities = [
      "Aircon",
      "TV",
      "CoffeeMachine",
      "Kettle",
      "HairDryer",
      "Iron",
      "Tub",
      "Pool",
      "BusinessCenter",
      "WiFi",
      "DryCleaning",
      "DryCleaner",
      "Breakfast",
      "Parking",
      "Childcare",
      "Bar",
      "Concierge",
    ];

    const result = categorizeFacilities(facilities);

    expect(result).toEqual({
      general: [
        "pool",
        "business center",
        "wifi",
        "dry cleaner",
        "dry cleaner",
        "breakfast",
        "parking",
        "childcare",
        "bar",
        "concierge",
      ],
      room: [
        "air conditioner",
        "television",
        "coffee machine",
        "kettle",
        "hair dryer",
        "iron",
        "bathtub",
      ],
    });
  });

  it("should categorize new facilities as general", () => {
    const facilities = ["Spa", "Gym", "Lounge"];

    const result = categorizeFacilities(facilities);

    expect(result).toEqual({
      general: ["spa", "gym", "lounge"],
      room: [],
    });
  });

  it("should handle mixed case facilities and camelCase facilities", () => {
    const facilities = ["DryCleaner", "DryCleaning", "dry cleaner"];

    const result = categorizeFacilities(facilities);

    expect(result).toEqual({
      general: ["dry cleaner", "dry cleaner", "dry cleaner"],
      room: [],
    });
  });
});
