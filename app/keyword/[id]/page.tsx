import {
  DETAIL_MOVIE_PATH,
  MOVIE_API_URL,
  MOVIE_BASE_URL,
} from "@/utils/constants";
import { MovieApiResponse, MovieProps } from "@/types";
import dynamic from "next/dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const { movies, keyword } = await getData(params.id);
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
