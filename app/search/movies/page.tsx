import dynamic from "next/dynamic";
import { getMovies } from "@/app/api/search/[query]/route";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  const { query } = searchParams;
  const { movies, total, limit } = await getData(query);

  const DynamicListPage = dynamic(() => import("./list-page"));
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
