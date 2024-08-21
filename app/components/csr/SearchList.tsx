import React from "react";
import CardList from "../CardList";
import { BookProps, LikedBook, LikedMovie, MovieProps } from "@/types";
import MovieInfo from "../MovieInfo";
import BookInfo from "../BookInfo";

type Props = {
  type: string;
  query: string;
  searchedMovies?: LikedMovie[];
  searchedBooks?: LikedBook[];
};
const SearchList = ({ type, query, searchedMovies, searchedBooks }: Props) => {
  return (
    <CardList
      title={type === "movie" ? "Movie List" : "Book List"}
      targetUrl={
        type === "movie"
          ? `/search/movies?query=${query}`
          : `/search/books?query=${query}`
      }
    >
      {type === "movie" &&
        searchedMovies?.map((item: MovieProps) => {
          return <MovieInfo key={item.id} movie={item} />;
        })}
      {type === "book" &&
        searchedBooks?.map((item: BookProps) => {
          return <BookInfo key={item.isbn} book={item} />;
        })}
    </CardList>
  );
};

export default SearchList;
