import { z } from "zod";

export async function fetchData<T>(
  url: string,
  schema: z.ZodType<T>,
): Promise<T> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const data = await response.json();
  return schema.parse(data);
}
