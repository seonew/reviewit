import dynamic from "next/dynamic";
import { getBooks } from "./api/route";

export default async function Page() {
  const { books, total, limit } = await getData();
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage books={books} total={total} limit={limit} />;
}

async function getData() {
  const startNumber = 1;
  const displayCount = 20;

  try {
    const result = await getBooks(startNumber, displayCount);
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
