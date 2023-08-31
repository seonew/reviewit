import { movieApiUrl, movieBaseUrl, movieImageUrl } from "@/utils/constants";
import { VideoImageBannerProps, MovieProps } from "@/utils/types";
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
    const movie_api_key = process.env.MOVIE_READONLY_API_KEY;
    const url = `${movieApiUrl}/discover/movie?include_adult=false&language=ko-KR&region=KR&certification.lte=MA%2015%2B&sort_by=popularity.desc`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${movie_api_key}`,
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
          posterImage: `${movieBaseUrl}/t/p/w440_and_h660_face${movie.poster_path}`,
          releaseDate: movie.release_date,
          link: `/movie/${movie.id}`,
          description: movie.overview,
          average: movie.vote_average,
        };
      }
    );

    const nowPlayingUrl = `${movieApiUrl}/movie/now_playing?language=ko-KR&region=KR`;
    const nowPlayingResponse = await fetch(nowPlayingUrl, options);
    const nowPlayingData = await nowPlayingResponse.json();
    const nowPlaying = nowPlayingData.results;
    const movieId =
      nowPlaying[Math.floor(Math.random() * nowPlaying.length)].id;

    const movieDetailUrl = `${movieApiUrl}/movie/${movieId}?language=ko-KR&append_to_reponse=videos`;
    const movieDetailResponse = await fetch(movieDetailUrl, options);
    const movieDetailData = await movieDetailResponse.json();
    const imageBannerInfo: VideoImageBannerProps = {
      id: movieDetailData.id,
      title: movieDetailData.title,
      posterImage: `${movieBaseUrl}/t/p/w440_and_h660_face${movieDetailData.poster_path}`,
      backdropImage: `${movieImageUrl}/t/p/original${movieDetailData.backdrop_path}`,
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
