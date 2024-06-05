import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Hotels" }];

export default function Index() {
  return (
    <main className="relative min-h-screen bg-white flex-col sm:flex sm:items-center sm:justify-center">
      <a href="/hotels">All hotels</a>
      <a href="/hotels?ids=iJhz,SjyX">multiple hotels</a>
      <a href="/hotels?destination=5432">destination</a>
      <a href="/refresh">refresh data</a>
    </main>
  );
}
