"use client";

import { MovieProps } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import MovieInfo from "@/app/components/MovieInfo";
import { useEffect, useState } from "react";
import Pagination from "@/app/components/Pagination";
import { useSearchParams } from "next/navigation";
import CardListSkeleton from "@/app/components/skeleton/CardListSkeleton";

type Props = {
  movies: MovieProps[];
  total: number;
  limit: number;
};

const List = ({ movies, total, limit }: Props) => {
  const {
    initializeSearchedMovies,
    updateSearchedMovies,
    clearSearchedMovies,
    setQuery,
    query,
    loadedMovies,
    searchedMovies,
  } = useStore();
  const [page, setPage] = useState<number>(1);
  const searchPamams = useSearchParams();
  const urlQuery = searchPamams.get("query");

  const handleClickPage = (current: number) => {
    setPage(current);
    updateSearchedMovies(current);
  };

  const handleClickPrevButton = () => {
    setPage(page - 1);
    updateSearchedMovies(page - 1);
  };

  const handleClickNextButton = () => {
    setPage(page + 1);
    updateSearchedMovies(page + 1);
  };

  useEffect(() => {
    initializeSearchedMovies(movies);

    if (urlQuery) {
      setQuery(urlQuery);
    }

    return () => {
      clearSearchedMovies();
    };
  }, [
    clearSearchedMovies,
    initializeSearchedMovies,
    movies,
    setQuery,
    urlQuery,
  ]);

  return (
    <div className="contents-container">
      {!loadedMovies ? (
        <CardListSkeleton arrayRows={[0, 1, 2, 3]} />
      ) : (
        <>
          <CardList title={`영화 ${query} 검색 결과`} color={"text-ozip-blue"}>
            {searchedMovies &&
              searchedMovies.map((item: MovieProps) => {
                return <MovieInfo key={item.id} movie={item} />;
              })}
          </CardList>
          <Pagination
            total={total}
            limit={limit}
            currentPage={page}
            onClickPage={handleClickPage}
            onClickPrev={handleClickPrevButton}
            onClickNext={handleClickNextButton}
          />
        </>
      )}
    </div>
  );
};

export default List;
