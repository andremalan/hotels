/**
 * Normallizes ammenities across the various suppliers, creating source of truth versions.
 * Could probably apply machine learning to make this more robust over a large dataset but
 * this is sufficient for the current data we have.
 *
 * 1. Converts to lowercase
 * 2. Replaces camelCase with spaces
 * 3. Replaces shortened words with full versions
 * 4. Trims whitespace
 *
 */
export const normalizeAmenity = (facility: string) => {
  // Convert to lowercase and replace camelCase with spaces
  let normalized = facility
    .trim()
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .toLowerCase();

  // Replace shortened words with their full versions
  const replacements: Record<string, string> = {
    aircon: "air conditioner",
    tub: "bathtub",
    tv: "television",
    coffeemachine: "coffee machine",
    hairdryer: "hair dryer",
    drycleaner: "dry cleaning",
    drycleaning: "dry cleaning",
    "dry cleaning": "dry cleaning",
    "dry cleaner": "dry cleaning",
    "wi fi": "wifi",
    "bath tub": "bathtub",
  };

  normalized = replacements[normalized] || normalized;

  return normalized;
};

export function categorizeAmenities(facilities: string[]): {
  general: string[];
  room: string[];
} {
  const roomFacilities = new Set([
    "air conditioner",
    "television",
    "coffee machine",
    "kettle",
    "hair dryer",
    "iron",
    "bathtub",
  ]);

  const categorized: { general: string[]; room: string[] } = {
    general: [],
    room: [],
  };

  facilities.forEach((facility) => {
    const normalized = normalizeAmenity(facility);

    if (roomFacilities.has(normalized)) {
      categorized.room.push(normalized);
    } else {
      categorized.general.push(normalized);
    }
  });

  return categorized;
}
