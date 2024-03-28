import Link from "next/link";
import React from "react";

const NoSearchResults = () => {
  const keywords = ["프란츠", "카프카", "헤르만헤세", "동물", "농장"];

  return (
    <main className="grid min-h-full place-items-center bg-white px-8 -mt-20">
      <div className="text-center">
        <h1 className="mt-4 font-bold tracking-tight text-gray-900 text-5xl">
          검색 결과가 없어요.
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          이런 검색어는 어떠세요?
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {keywords.map((keyword) => {
            return (
              <Link href={`/search?query=${keyword}`} key={keyword}>
                <span className="rounded-lg bg-ozip-blue px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ozip-blue">
                  {keyword}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
};

export default NoSearchResults;
