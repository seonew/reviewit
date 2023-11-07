"use client";

import CardList from "@/app/components/CardList";
import { MovieProps } from "@/types";
import MovieInfo from "@/app/components/MovieInfo";

type Props = {
  movies: MovieProps[] | null;
  keyword: string;
};

const List = ({ movies, keyword }: Props) => {
  return (
    <div className="contents-container">
      <CardList title={`${keyword}`} color={"text-black"}>
        {movies &&
          movies.map((item: MovieProps) => {
            return <MovieInfo key={item.id} item={item} />;
          })}
      </CardList>
    </div>
  );
};

export default List;
