import { json, LoaderFunctionArgs } from "@remix-run/node";

import { Hotel } from "~/models/hotel";
/**
 * Main endpoint for the exercise.
 * Allows for filtering by hotel ids or destination as well as all hotels by default.
 *
 * This does not query suppliers directly, but instead queries the database for hotels.
 * A direct query might have been simpler, but architectually just felt icky, so opted for storing in a DB.
 * The DB also gives us indexing for free, so makes filtering by destination or ids simpler.
 */
export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const hotelIds = url.searchParams.get("ids");
  const destination = url.searchParams.get("destination");

  if (hotelIds) {
    const hotels = await Hotel.byIds(hotelIds.split(","));
    return json(hotels);
  }

  if (destination) {
    const hotels = await Hotel.byDestination(parseInt(destination));
    return json(hotels);
  }

  const allHotels = await Hotel.all();
  return json(allHotels);
};
