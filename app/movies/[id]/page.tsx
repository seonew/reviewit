import dynamic from "next/dynamic";
import { loadMovieContents, loadMovieInfo } from "@/app/api/movies/common";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { ERROR_PAGE_404_MESSAGE, LOGO } from "@/utils/constants";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const currentMovie = await getData(id);
  let title = "";

  if (!currentMovie) {
    title = `${ERROR_PAGE_404_MESSAGE}`;
  } else {
    title = `${currentMovie.movie.title} | ${LOGO}`;
  }

  return {
    title,
  };
}

export default async function Page({ params }: Props) {
  const { id } = params;
  const movieContents = await getData(id);
  if (!movieContents) {
    notFound();
  }

  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage id={id} movieContents={movieContents} />;
}

async function getData(id: string) {
  const movie = await loadMovieInfo(id);
  if (!movie) {
    return null;
  }

  const data = await loadMovieContents(id);
  return { ...data, movie };
}
