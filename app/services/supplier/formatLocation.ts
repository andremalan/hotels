import { HotelData } from "~/types";
interface LocationInfo {
  lat: number | null | string | undefined;
  lng: number | null | string | undefined;
  address: string | null;
  postalCode: string | null;
  city: string;
  country: string;
}
/**
 * Deals with location complexities and differences.
 * There's obviously a lot more that goes into actual location formatting,
 * but this is the minimal needed to transfrom the example data into something reasonable.
 *
 * 1. trims the address
 * 2. formats the address and postal code
 * 3. normalizes the country name
 *
 */
export function formatLocation({
  address,
  city,
  country,
  postalCode,
  lat,
  lng,
}: LocationInfo): HotelData["location"] {
  const trimmedAddress = address?.trim() || "";
  return {
    lat: Number(lat) || null,
    lng: Number(lng) || null,
    address: postalCode
      ? `${trimmedAddress}, ${postalCode}`
      : trimmedAddress?.trim() || "",
    city,
    country: country === "SG" ? "Singapore" : country,
  };
}
