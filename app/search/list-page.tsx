"use client";

import React, { useEffect } from "react";
import { BookProps, MovieProps } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import BookInfo from "@/app/components/BookInfo";
import MovieInfo from "../components/MovieInfo";
import Skeleton from "./components/Skeleton";
import Empty from "../components/Empty";
import NoSearchResults from "./components/NoSearchResults";

type Props = {
  keyword: string;
};

const List = ({ keyword }: Props) => {
  const {
    searchedBooks,
    updateSearchedBooks,
    clearSearchedBooks,
    loading,
    searchedMovies,
    updateSearchedMovies,
    clearSearchedMovies,
    query,
    setQuery,
  } = useStore();

  useEffect(() => {
    if (keyword) {
      setQuery(keyword);
    }

    updateSearchedBooks(1, 10);
    updateSearchedMovies(1, 10);

    return () => {
      clearSearchedBooks();
      clearSearchedMovies();
    };
  }, [
    clearSearchedBooks,
    clearSearchedMovies,
    keyword,
    setQuery,
    updateSearchedBooks,
    updateSearchedMovies,
  ]);

  return (
    <div className="contents-container">
      {loading ? (
        <>
          <Skeleton arrayRows={[0, 1]} />
          <Skeleton arrayRows={[0, 1]} />
        </>
      ) : searchedMovies?.length === 0 && searchedBooks?.length === 0 ? (
        <NoSearchResults />
      ) : (
        <>
          {searchedMovies?.length > 0 ? (
            <CardList
              title={"Movie List"}
              targetUrl={`/search/movies?query=${query}`}
              color="text-black"
            >
              {searchedMovies &&
                searchedMovies.map((item: MovieProps) => {
                  return <MovieInfo key={item.id} movie={item} />;
                })}
            </CardList>
          ) : (
            <Empty
              title={"Movie List"}
              message={"검색된 결과가 없어요 ㅜ.ㅜ"}
              color="text-black"
            />
          )}
          {searchedBooks?.length > 0 ? (
            <CardList
              title={"Book List"}
              targetUrl={`/search/books?query=${query}`}
              color="text-black"
            >
              {searchedBooks &&
                searchedBooks.map((item: BookProps) => {
                  return <BookInfo key={item.isbn} book={item} />;
                })}
            </CardList>
          ) : (
            <Empty
              title={"Book List"}
              message={"검색된 결과가 없어요 ㅜ.ㅜ"}
              color="text-black"
            />
          )}
        </>
      )}
    </div>
  );
};

export default List;
