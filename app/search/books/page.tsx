import { getBooks } from "@/app/api/search/[query]/route";
import dynamic from "next/dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { query } = searchParams;
  const { books, total, limit } = await getData(query);

  const DynamicListPage = dynamic(() => import("./list-page"), { ssr: false });
  return <DynamicListPage books={books} total={total} limit={limit} />;
}

async function getData(query?: string) {
  const startNumber = 1;
  const displayCount = 20;

  try {
    if (!query) {
      throw new Error();
    }

    const result = await getBooks(query, startNumber, displayCount);
    return result;
  } catch (e) {
    console.error(e);
    return {
      books: null,
      total: 0,
      limit: displayCount,
    };
  }
}
