import Link from "next/link";

export default function NotFound() {
  return (
    <div className="contents-container">
      <main className="grid min-h-full place-items-center bg-white px-8">
        <div className="text-center">
          <h1 className="mt-4 font-bold tracking-tight text-gray-900 text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Sorry, we couldn’t find the page you’re looking for.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link
              href="/"
              className="rounded-md bg-ozip-blue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ozip-blue"
            >
              Go back home
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
