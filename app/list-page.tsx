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
  const { fetchDashboardMovies } = useStore();

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
            return <MovieInfo key={item.title} movie={item} />;
          })}
      </CardList>
    </div>
  );
};

export default List;
