import { getBooks } from "@/app/api/search/[query]/route";
import { LOGO } from "@/utils/constants";
import { Metadata } from "next";
import dynamic from "next/dynamic";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { query } = searchParams;
  const { total } = await getData(query);

  return {
    title: `${query}의 도서 검색결과 ${total}개 | ${LOGO}`,
  };
}

export default async function Page({ searchParams }: Props) {
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
      books: [],
      total: 0,
      limit: displayCount,
    };
  }
}
