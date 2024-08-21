"use client";

import { useEffect } from "react";
import { useBoundStore as useStore } from "@/store";
import { VideoImageBannerProps, MovieProps } from "@/types";
import CardList from "@/app/components/CardList";
import MovieInfo from "@/app/components/MovieInfo";

type Props = {
  movies: MovieProps[] | null;
  imageBannerInfo?: VideoImageBannerProps | null;
};

const OnlyList = ({ movies }: Props) => {
  const { setDashboardMovies } = useStore();

  useEffect(() => {
    if (movies) {
      setDashboardMovies(movies);
    }
  }, [setDashboardMovies, movies]);

  return (
    <CardList title={"Movie List"}>
      {movies &&
        movies.map((item: MovieProps) => {
          return (
            <MovieInfo key={item.title} movie={item} isBookmarked={false} />
          );
        })}
    </CardList>
  );
};

export default OnlyList;
