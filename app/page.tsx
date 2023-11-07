import {
  MOVIE_API_URL,
  MOVIE_BASE_URL,
  MOVIE_IMAGE_URL,
} from "@/utils/constants";
import { VideoImageBannerProps, MovieProps } from "@/types";
import dynamic from "next/dynamic";

export default async function Home() {
  const { movies, imageBannerInfo } = await getData();
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage movies={movies} imageBannerInfo={imageBannerInfo} />;
}

async function getData() {
  try {
    const movieApiKey = process.env.MOVIE_READONLY_API_KEY;
    const url = `${MOVIE_API_URL}/discover/movie?include_adult=false&language=ko-KR&region=KR&certification.lte=MA%2015%2B&sort_by=popularity.desc`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${movieApiKey}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();
    const movies = data.results;
    const movieResult: MovieProps[] = movies.map(
      (movie: {
        id: string;
        title: string;
        poster_path: string;
        release_date: string;
        overview: string;
        vote_average: number;
      }) => {
        return {
          id: movie.id,
          title: movie.title,
          posterImage: `${MOVIE_BASE_URL}/t/p/w440_and_h660_face${movie.poster_path}`,
          releaseDate: movie.release_date,
          link: `/movie/${movie.id}`,
          description: movie.overview,
          average: movie.vote_average,
        };
      }
    );

    const nowPlayingUrl = `${MOVIE_API_URL}/movie/now_playing?language=ko-KR&region=KR`;
    const nowPlayingResponse = await fetch(nowPlayingUrl, options);
    const nowPlayingData = await nowPlayingResponse.json();
    const nowPlaying = nowPlayingData.results;
    const movieId =
      nowPlaying[Math.floor(Math.random() * nowPlaying.length)].id;

    const movieDetailUrl = `${MOVIE_API_URL}/movie/${movieId}?language=ko-KR&append_to_reponse=videos`;
    const movieDetailResponse = await fetch(movieDetailUrl, options);
    const movieDetailData = await movieDetailResponse.json();
    const imageBannerInfo: VideoImageBannerProps = {
      id: movieDetailData.id,
      title: movieDetailData.title,
      posterImage: `${MOVIE_BASE_URL}/t/p/w440_and_h660_face${movieDetailData.poster_path}`,
      backdropImage: `${MOVIE_IMAGE_URL}/t/p/original${movieDetailData.backdrop_path}`,
      releaseDate: movieDetailData.release_date,
      link: `/movie/${movieDetailData.id}`,
      description: movieDetailData.overview,
    };

    return { movies: movieResult, imageBannerInfo };
  } catch (error) {
    console.log(error);
    return { movies: null, imageBannerInfo: null };
  }
}
