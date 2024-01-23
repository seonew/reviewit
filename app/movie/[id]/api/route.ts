import {
  MOVIE_API_URL,
  MOVIE_BASE_URL,
  MOVIE_IMAGE_URL,
} from "@/utils/constants";
import { DetailMovieProps } from "@/types";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const movieId = params.id;

  try {
    const result = await loadMovieInfo(movieId);
    return NextResponse.json(result);
  } catch (error) {
    console.log(error);
  }

  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}

export const loadMovieInfo = async (movieId: string) => {
  const movieApiKey = process.env.MOVIE_READONLY_API_KEY;
  const url = `${MOVIE_API_URL}/movie/${movieId}?language=ko-KR`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${movieApiKey}`,
    },
  };
  const response = await fetch(url, options);
  const data = await response.json();
  const movie: DetailMovieProps = {
    id: data.id,
    genres: data.genres,
    originalTitle: data.original_title,
    title: data.title,
    description: data.overview,
    tagline: data.tagline,
    releaseDate: data.release_date,
    budget: data.budget === 0 ? undefined : data.budget,
    revenue: data.revenue === 0 ? undefined : data.revenue,
    runtime: data.runtime === 0 ? undefined : data.runtime,
    average: data.vote_average === 0 ? undefined : data.vote_average,
    posterImage:
      data.poster_path !== null
        ? `${MOVIE_BASE_URL}/t/p/w440_and_h660_face${data.poster_path}`
        : undefined,
    backdropImage:
      data.backdrop_path !== null
        ? `${MOVIE_IMAGE_URL}/t/p/original${data.backdrop_path}`
        : undefined,
    adult: data.adult,
  };

  return movie;
};
