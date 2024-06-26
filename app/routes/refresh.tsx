import { json } from "@remix-run/node";

import { Hotel } from "~/models/hotel";
import { SupplierService } from "~/services/supplierService";
/**
 * Route to refresh data from suppliers.
 * Ideally this would be executed by a worker, or maybe a webhook per supplier but for now
 * we can have it be a GET request to make validating from the browser easier.
 */
export const loader = async () => {
  const hotels = await SupplierService.hotels();
  Hotel.saveHotels(hotels);
  return json(hotels);
};
