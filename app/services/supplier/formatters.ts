import { HotelData } from "~/types";
interface LocationInfo {
  lat: number | null | string | undefined;
  lng: number | null | string | undefined;
  address: string | null;
  postalCode: string | null;
  city: string;
  country: string;
}

export function locationFormatter({
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
