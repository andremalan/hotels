import { describe, it, expect } from "vitest";

import { formatLocation } from "./formatLocation";

describe("formatLocation", () => {
  it("should format location correctly with all fields present", () => {
    const locationInfo = {
      address: " 123 Main St ",
      city: "City A",
      country: "SG",
      postalCode: "12345",
      lat: "1.23",
      lng: "4.56",
    };

    const result = formatLocation(locationInfo);

    expect(result).toEqual({
      lat: 1.23,
      lng: 4.56,
      address: "123 Main St, 12345",
      city: "City A",
      country: "Singapore",
    });
  });

  it("should format location correctly without postal code", () => {
    const locationInfo = {
      address: " 123 Main St ",
      city: "City A",
      country: "SG",
      postalCode: null,
      lat: "1.23",
      lng: "4.56",
    };

    const result = formatLocation(locationInfo);

    expect(result).toEqual({
      lat: 1.23,
      lng: 4.56,
      address: "123 Main St",
      city: "City A",
      country: "Singapore",
    });
  });

  it("should handle null and undefined latitude and longitude", () => {
    const locationInfo = {
      address: "123 Main St",
      city: "City A",
      country: "SG",
      postalCode: "12345",
      lat: null,
      lng: undefined,
    };

    const result = formatLocation(locationInfo);

    expect(result).toEqual({
      lat: null,
      lng: null,
      address: "123 Main St, 12345",
      city: "City A",
      country: "Singapore",
    });
  });

  it("should handle empty address and postal code", () => {
    const locationInfo = {
      address: null,
      city: "City A",
      country: "SG",
      postalCode: "",
      lat: "1.23",
      lng: "4.56",
    };

    const result = formatLocation(locationInfo);

    expect(result).toEqual({
      lat: 1.23,
      lng: 4.56,
      address: "",
      city: "City A",
      country: "Singapore",
    });
  });

  it("should handle non-SG country codes correctly", () => {
    const locationInfo = {
      address: "123 Main St",
      city: "City A",
      country: "US",
      postalCode: "12345",
      lat: "1.23",
      lng: "4.56",
    };

    const result = formatLocation(locationInfo);

    expect(result).toEqual({
      lat: 1.23,
      lng: 4.56,
      address: "123 Main St, 12345",
      city: "City A",
      country: "US",
    });
  });

  it("should handle string representation of null and undefined lat/lng", () => {
    const locationInfo = {
      address: "123 Main St",
      city: "City A",
      country: "SG",
      postalCode: "12345",
      lat: "null",
      lng: "undefined",
    };

    const result = formatLocation(locationInfo);

    expect(result).toEqual({
      lat: null,
      lng: null,
      address: "123 Main St, 12345",
      city: "City A",
      country: "Singapore",
    });
  });
});
