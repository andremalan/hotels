import { SupplierOneService } from "./suppliers/supplierOne";

interface Location {
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
}

interface Image {
  link: string;
  description: string;
}

interface Amenities {
  general: string[];
  room: string[];
}

export interface SupplierOutput {
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

export class SupplierService {
  suppliers = [SupplierOneService];

  async getTransformedData(): Promise<SupplierOutput[]> {
    const transformedData = await Promise.all(
      this.suppliers.map(async (supplier) => {
        const service = new supplier();
        const data = await service.fetchData();
        return service.transformData(data);
      }),
    );
    return transformedData.flat();
  }
}
