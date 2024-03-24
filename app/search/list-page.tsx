"use client";

import React, { useEffect } from "react";
import { BookProps, MovieProps } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import BookInfo from "@/app/components/BookInfo";
import MovieInfo from "../components/MovieInfo";
import SearchSection from "./components/SearchSection";
import Skeleton from "./components/Skeleton";

const List = () => {
  const {
    searchedBooks,
    updateSearchedBooks,
    clearSearchedBooks,
    loading,
    searchedMovies,
    updateSearchedMovies,
    clearSearchedMovies,
    query,
  } = useStore();

  useEffect(() => {
    updateSearchedBooks(1, 10);
    updateSearchedMovies(1, 10);

    return () => {
      clearSearchedBooks();
      clearSearchedMovies();
    };
  }, [
    clearSearchedBooks,
    clearSearchedMovies,
    updateSearchedBooks,
    updateSearchedMovies,
  ]);

  return (
    <div className="contents-container">
      <SearchSection />
      {loading ? (
        <Skeleton arrayRows={[0, 1]} />
      ) : (
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
      )}
      {loading ? (
        <Skeleton arrayRows={[0, 1]} />
      ) : (
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
      )}
    </div>
  );
};

export default List;
