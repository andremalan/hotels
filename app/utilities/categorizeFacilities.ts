export function categorizeFacilities(facilities: string[]): {
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

  const normalizeFacility = (facility: string) => {
    // Convert to lowercase and replace camelCase with spaces
    let normalized = facility.replace(/([a-z])([A-Z])/g, "$1 $2").toLowerCase();

    // Replace shortened words with their full versions
    const replacements: Record<string, string> = {
      aircon: "air conditioner",
      tub: "bathtub",
      tv: "television",
      coffeemachine: "coffee machine",
      hairdryer: "hair dryer",
      drycleaner: "dry cleaner",
      drycleaning: "dry cleaner",
      "dry cleaning": "dry cleaner",
      "wi fi": "wifi",
    };

    normalized = replacements[normalized] || normalized;

    return normalized;
  };

  const categorized: { general: string[]; room: string[] } = {
    general: [],
    room: [],
  };

  facilities.forEach((facility) => {
    const normalized = normalizeFacility(facility);

    if (roomFacilities.has(normalized)) {
      categorized.room.push(normalized);
    } else {
      categorized.general.push(normalized);
    }
  });

  return categorized;
}
