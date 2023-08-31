import { movieApiUrl, movieBaseUrl } from "@/utils/constants";
import { MovieProps } from "@/utils/types";
import dynamic from "next/dynamic";

export default async function Page({ params }: { params: { id: string } }) {
  const { movies, keyword } = await getData(params.id);
  const DynamicListPage = dynamic(() => import("./list-page"));
  return <DynamicListPage movies={movies} keyword={keyword} />;
}

async function getData(keywordId: string) {
  try {
    const movie_api_key = process.env.MOVIE_READONLY_API_KEY;
    const url = `${movieApiUrl}/keyword/${keywordId}/movies?language=ko-KR&include_adult=false`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${movie_api_key}`,
      },
    };
    const response = await fetch(url, options);
    const data = await response.json();
    const keywordMoviesResult = data.results;
    const movies: MovieProps[] = keywordMoviesResult.map(
      (keywordMovie: {
        id: string;
        title: string;
        overview: string;
        release_date: string;
        poster_path: string;
        vote_average: string;
      }) => {
        return {
          id: keywordMovie.id,
          title: keywordMovie.title,
          description: keywordMovie.overview,
          releaseDate: keywordMovie.release_date,
          posterImage:
            keywordMovie.poster_path !== null
              ? `${movieBaseUrl}/t/p/w440_and_h660_face${keywordMovie.poster_path}`
              : undefined,
          link: `/movie/${keywordMovie.id}`,
          average: keywordMovie.vote_average,
        };
      }
    );

    const keywordUrl = `${movieApiUrl}/keyword/${keywordId}`;
    const keywordResponse = await fetch(keywordUrl, options);
    const keywordData = await keywordResponse.json();

    return { movies, keyword: keywordData.name };
  } catch (error) {
    console.log(error);
    return { movies: null, keyword: null };
  }
}
