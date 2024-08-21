import {
  DETAIL_MOVIE_PATH,
  LOGO,
  MOVIE_API_URL,
  MOVIE_BASE_URL,
  MOVIE_IMAGE_URL,
} from "@/utils/constants";
import { VideoImageBannerProps, MovieProps, MovieApiResponse } from "@/types";
import dynamic from "next/dynamic";
import { Metadata } from "next";
import Banner from "./components/Banner";
import Skeleton from "./components/skeleton/CardListSkeleton";
import { Suspense } from "react";
import OnlyListComponent from "./components/csr/OnlyList";
import SuspenseListComponent from "./components/csr/SuspenseList";
import DynamicListComponent from "./components/csr/DynamicList";
// CSR
import AppDynamicListPage from "./app-dynamic";
import AppSuspenseListPage from "./app-suspense";
import NoCustomCSSBanner from "./components/csr/NoCustomCSSBanner";
import MainSkeleton from "./components/csr/skeleton/MainSkeleton";

export const metadata: Metadata = {
  title: `${LOGO}`,
};

export default async function Home() {
  const { movies, imageBannerInfo } = await getData();

  const array = Array.from({ length: 5 }, (_, i) => i);
  // 현재 적용된 컴포넌트
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
    loading: () => <MainSkeleton />,
  });

  // CSR
  // CSR(list-page)
  // CSR(banner) + CSR(list-withSuspense)
  // CSR(banner) + CSR(list-withLoading)

  // SSR
  // SSR(banner) + SSR(list-withSuspense)
  // SSR(banner) + SSR(list-withLoading)
  // SSR(banner) + CSR(list-withSuspense)
  // SSR(banner) + CSR(list-withLoading)
  const DynamicWithSuspenseListPage = dynamic(
    () => import("./components/csr/SuspenseList"),
    {
      ssr: false,
    }
  );
  const DynamicWithLoadingListPage = dynamic(
    () => import("./components/csr/OnlyList"),
    {
      ssr: false,
      loading: () => <Skeleton arrayRows={array} />,
    }
  );

  // SSR
  // loading X
  const SSRWithSuspenseListPage = () => (
    <div className="contents-container">
      {imageBannerInfo && <Banner info={imageBannerInfo} />}
      <Suspense fallback={<MainSkeleton />}>
        <OnlyListComponent movies={movies} />
      </Suspense>
    </div>
  );
  const SSRWithLoadingListPage = () => (
    <div className="relative top-20 block h-screen min-w-1024">
      {imageBannerInfo && <NoCustomCSSBanner info={imageBannerInfo} />}
      <DynamicWithLoadingListPage
        movies={movies}
        imageBannerInfo={imageBannerInfo}
      />
    </div>
  );

  // SSR + CSR
  const SSRCSRWithSuspenseListPage = () => (
    <div className="contents-container">
      {imageBannerInfo && <NoCustomCSSBanner info={imageBannerInfo} />}
      <DynamicWithSuspenseListPage movies={movies} />
    </div>
  );
  const SSRCSRWithLoadingListPage = () => (
    <div className="contents-container">
      {imageBannerInfo && <NoCustomCSSBanner info={imageBannerInfo} />}
      <DynamicListComponent movies={movies} imageBannerInfo={imageBannerInfo} />
    </div>
  );

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
    const movieResult: MovieProps[] = movies.map((movie: MovieApiResponse) => {
      return {
        id: movie.id,
        title: movie.title,
        posterImage: `${MOVIE_BASE_URL}/t/p/w440_and_h660_face${movie.poster_path}`,
        releaseDate: movie.release_date,
        link: `${DETAIL_MOVIE_PATH}/${movie.id}`,
        description: movie.overview,
        average: movie.vote_average,
      };
    });

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
      link: `${DETAIL_MOVIE_PATH}/${movieDetailData.id}`,
      description: movieDetailData.overview,
    };

    return { movies: movieResult, imageBannerInfo };
  } catch (error) {
    console.log(error);
    return { movies: null, imageBannerInfo: null };
  }
}
