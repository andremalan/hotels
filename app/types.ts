export interface Location {
  lat: number | null;
  lng: number | null;
  address: string;
  city: string;
  country: string;
}

export interface Image {
  link: string;
  description: string;
}

export interface Amenities {
  general: string[];
  room: string[];
}

export interface HotelData {
  id: string;
  destination_id: number;
  name: string;
  location: Location;
  description: string;
  amenities: Amenities;
  images: {
    rooms: Image[];
    site: Image[];
    amenities: Image[];
  };
  booking_conditions: string[];
}
