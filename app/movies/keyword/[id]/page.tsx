import {
  DETAIL_MOVIE_PATH,
  ERROR_PAGE_404_MESSAGE,
  LOGO,
  MOVIE_API_URL,
  MOVIE_BASE_URL,
} from "@/utils/constants";
import { MovieApiResponse, MovieProps } from "@/types";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const { keyword } = await getData(id);
  let title = "";

  if (!id) {
    title = `${ERROR_PAGE_404_MESSAGE}`;
  } else {
    title = `${keyword}의 키워드 검색 결과 | ${LOGO}`;
  }

  return {
    title,
  };
}

export default async function Page({ params }: Props) {
  const { id } = params;
  if (!id) {
    notFound();
  }

  const { movies, keyword } = await getData(id);
  const DynamicListPage = dynamic(() => import("./list-page"));
  return <DynamicListPage movies={movies} keyword={keyword} />;
}

async function getData(keywordId: string) {
  try {
    const movieApiKey = process.env.MOVIE_READONLY_API_KEY;
    const url = `${MOVIE_API_URL}/keyword/${keywordId}/movies?language=ko-KR&include_adult=false`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${movieApiKey}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    const keywordMoviesResult = data.results;
    const movies: MovieProps[] = keywordMoviesResult.map(
      (keywordMovie: MovieApiResponse) => {
        return {
          id: keywordMovie.id,
          title: keywordMovie.title,
          description: keywordMovie.overview,
          releaseDate: keywordMovie.release_date,
          posterImage:
            keywordMovie.poster_path !== null
              ? `${MOVIE_BASE_URL}/t/p/w440_and_h660_face${keywordMovie.poster_path}`
              : undefined,
          link: `${DETAIL_MOVIE_PATH}/${keywordMovie.id}`,
          average: keywordMovie.vote_average,
        };
      }
    );

    const keywordUrl = `${MOVIE_API_URL}/keyword/${keywordId}`;
    const keywordResponse = await fetch(keywordUrl, options);
    const keywordData = await keywordResponse.json();

    return { movies, keyword: keywordData.name };
  } catch (error) {
    console.log(error);
    return { movies: null, keyword: null };
  }
}
