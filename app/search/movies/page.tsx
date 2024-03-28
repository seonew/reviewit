import dynamic from "next/dynamic";
import { getMovies } from "@/app/api/search/[query]/route";
import { Metadata } from "next";
import { LOGO } from "@/utils/constants";

type Props = {
  searchParams: { [key: string]: string };
};

export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  const { query } = searchParams;
  const { total } = await getData(query);

  return {
    title: `${query}의 영화 검색결과 ${total}개 | ${LOGO}`,
  };
}

export default async function Page({ searchParams }: Props) {
  const { query } = searchParams;
  const { movies, total, limit } = await getData(query);

  const DynamicListPage = dynamic(() => import("./list-page"), { ssr: false });
  return <DynamicListPage movies={movies} total={total} limit={limit} />;
}

async function getData(query: string) {
  const startNumber = 1;
  const displayCount = 20;

  try {
    const result = await getMovies(query, startNumber, displayCount);
    return result;
  } catch (error) {
    console.log(error);
    return { movies: [], total: 0, limit: displayCount };
  }
}
