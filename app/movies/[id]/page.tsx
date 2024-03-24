import dynamic from "next/dynamic";
import { loadMovieContents, loadMovieInfo } from "@/app/api/movie/route";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const currentMovie = await getData(id);
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage id={id} currentMovie={currentMovie} />;
}

async function getData(id: string) {
  const movie = await loadMovieInfo(id);
  if (!movie) {
    notFound();
  }

  const data = await loadMovieContents(id);
  return { ...data, movie };
}
