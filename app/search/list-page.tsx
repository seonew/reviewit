"use client";

import React, { useEffect } from "react";
import { BookProps, MovieProps } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import BookInfo from "@/app/components/BookInfo";
import MovieInfo from "../components/MovieInfo";
import Empty from "../components/Empty";
import NoSearchResults from "./components/NoSearchResults";
import Skeleton from "../components/skeleton/CardSkeleton";

type Props = {
  keyword: string;
};

const List = ({ keyword }: Props) => {
  const {
    searchedBooks,
    updateSearchedBooks,
    clearSearchedBooks,
    searchedMovies,
    updateSearchedMovies,
    clearSearchedMovies,
    query,
    setQuery,
    loadedBooks,
    loadedMovies,
  } = useStore();

  useEffect(() => {
    clearSearchedMovies();
    clearSearchedBooks();
  }, [clearSearchedBooks, clearSearchedMovies]);

  useEffect(() => {
    if (keyword) {
      setQuery(keyword);
    }

    updateSearchedMovies(1, 10);
    updateSearchedBooks(1, 10);
  }, [keyword, setQuery, updateSearchedBooks, updateSearchedMovies]);

  if (!loadedMovies && !loadedBooks) {
    return (
      <div className="contents-container">
        <Skeleton arrayRows={[0, 1]} />
        <Skeleton arrayRows={[0, 1]} />
      </div>
    );
  }

  if (
    loadedMovies &&
    loadedBooks &&
    searchedMovies?.length === 0 &&
    searchedBooks?.length === 0
  ) {
    return (
      <div className="contents-container">
        <NoSearchResults />
      </div>
    );
  }

  return (
    <div className="contents-container">
      {!loadedMovies ? (
        <Skeleton arrayRows={[0, 1]} />
      ) : searchedMovies?.length > 0 ? (
        <CardList
          title={"Movie List"}
          targetUrl={`/search/movies?query=${query}`}
        >
          {searchedMovies.map((item: MovieProps) => {
            return <MovieInfo key={item.id} movie={item} />;
          })}
        </CardList>
      ) : (
        <Empty title={"Movie List"} message={"검색된 결과가 없어요 ㅜ.ㅜ"} />
      )}
      {!loadedBooks ? (
        <Skeleton arrayRows={[0, 1]} />
      ) : searchedBooks?.length > 0 ? (
        <CardList
          title={"Book List"}
          targetUrl={`/search/books?query=${query}`}
        >
          {searchedBooks.map((item: BookProps) => {
            return <BookInfo key={item.isbn} book={item} />;
          })}
        </CardList>
      ) : (
        <Empty title={"Book List"} message={"검색된 결과가 없어요 ㅜ.ㅜ"} />
      )}
    </div>
  );
};

export default List;
