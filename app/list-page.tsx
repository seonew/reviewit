"use client";

import { useEffect } from "react";
import { useBoundStore as useStore } from "@/store";
import { VideoImageBannerProps, MovieProps } from "@/types";
import CardList from "@/app/components/CardList";
import MovieInfo from "@/app/components/MovieInfo";
import Banner from "@/app/components/Banner";

type Props = {
  movies: MovieProps[] | null;
  imageBannerInfo: VideoImageBannerProps | null;
};

const List = ({ movies, imageBannerInfo }: Props) => {
  const { setDashboardMovies } = useStore();

  useEffect(() => {
    if (movies) {
      setDashboardMovies(movies);
    }
  }, [setDashboardMovies, movies]);

  return (
    <div className="contents-container">
      {imageBannerInfo && <Banner info={imageBannerInfo} />}
      <CardList title={"Movie List"}>
        {movies &&
          movies.map((item: MovieProps) => {
            return (
              <MovieInfo key={item.title} movie={item} isBookmarked={false} />
            );
          })}
      </CardList>
    </div>
  );
};

export default List;
