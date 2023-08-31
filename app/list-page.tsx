"use client";

import { VideoImageBannerProps, MovieProps } from "@/utils/types";
import CardList from "@/components/CardList";
import MovieInfo from "@/components/MovieInfo";
import Banner from "@/components/Banner";
import { useCallback, useEffect, useState } from "react";
import useStore from "@/store";
import { AuthInfo, initCallbackPage } from "coco-people-client";

type Props = {
  movies: MovieProps[] | null;
  imageBannerInfo: VideoImageBannerProps | null;
};

const List = ({ movies, imageBannerInfo }: Props) => {
  const { fetchDashboardMovies, fetchUserInfo, setIsSignedIn } = useStore();
  const [authInfo, setAuthInfo] = useState<AuthInfo | null>(null);

  const initialize = useCallback(async () => {
    try {
      const authInfo = await initCallbackPage();
      setAuthInfo(authInfo);
      setIsSignedIn(true);
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log(error);
      }
      setIsSignedIn(false);
    }
  }, [setIsSignedIn]);

  useEffect(() => {
    initialize();
    if (authInfo?.accessToken) {
      fetchUserInfo(authInfo?.accessToken);
    }
  }, [authInfo?.accessToken, fetchUserInfo, initialize]);

  useEffect(() => {
    if (movies) {
      fetchDashboardMovies(movies);
    }
  }, [fetchDashboardMovies, movies]);

  return (
    <div className="contents-container">
      {imageBannerInfo && <Banner info={imageBannerInfo} />}
      <CardList title={"Movie List"} color={"text-black"}>
        {movies &&
          movies.map((item: MovieProps) => {
            return <MovieInfo key={item.title} item={item} />;
          })}
      </CardList>
    </div>
  );
};

export default List;
