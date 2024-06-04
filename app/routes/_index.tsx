import type { MetaFunction } from "@remix-run/node";

export const meta: MetaFunction = () => [{ title: "Hotels" }];

export default function Index() {
  return (
    <main className="relative min-h-screen bg-white sm:flex sm:items-center sm:justify-center">
      <a href="/hotels">All hotels</a>
    </main>
  );
}
