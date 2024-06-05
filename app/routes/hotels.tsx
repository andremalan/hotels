import { json, LoaderFunctionArgs } from "@remix-run/node";

import { Hotel } from "~/models/hotel.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const hotelId = url.searchParams.get("id");
  const hotelIds = url.searchParams.get("ids");
  const destination = url.searchParams.get("destination");

  if (hotelId) {
    const hotel = await Hotel.byId(hotelId);
    return json(hotel);
  }

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
