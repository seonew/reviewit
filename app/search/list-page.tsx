"use client";

import React, { lazy, Suspense, useEffect } from "react";
import { BookProps, MovieProps } from "@/types";
import { useBoundStore as useStore } from "@/store";
import CardList from "@/app/components/CardList";
import BookInfo from "@/app/components/BookInfo";
import MovieInfo from "../components/MovieInfo";
import NoSearchResults from "./components/NoSearchResults";
import Empty from "../components/Empty";
import CardListSkeleton from "../components/skeleton/CardListSkeleton";
import dynamic from "next/dynamic";

type Props = {
  keyword: string;
};

const ListComponent = lazy(() => import("../components/csr/SearchList"));
const DynamicListPage = dynamic(() => import("../components/csr/SearchList"), {
  ssr: false,
  loading: () => <CardListSkeleton arrayRows={[0, 1]} />,
});

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

  // useEffect(() => {
  //   clearSearchedMovies();
  //   clearSearchedBooks();
  // }, [clearSearchedBooks, clearSearchedMovies]);

  useEffect(() => {
    if (keyword) {
      setQuery(keyword);
    }

    updateSearchedMovies(1, 10);
    updateSearchedBooks(1, 10);
  }, []);

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

  const MovieList = () => (
    <CardList title={"Movie List"} targetUrl={`/search/movies?query=${query}`}>
      {searchedMovies.map((item: MovieProps) => {
        return <MovieInfo key={item.id} movie={item} />;
      })}
    </CardList>
  );

  const BookList = () => (
    <CardList title={"Book List"} targetUrl={`/search/books?query=${query}`}>
      {searchedBooks.map((item: BookProps) => {
        return <BookInfo key={item.isbn} book={item} />;
      })}
    </CardList>
  );

  // TODO loading 컴포넌트 화면이 왜 중간에서부터 시작되는가?

  return (
    <div className="contents-container">
      {loadedMovies &&
        (searchedMovies?.length > 0 ? (
          // <MovieList />
          // <Suspense fallback={<CardListSkeleton arrayRows={[0, 1]} />}>
          //   <ListComponent
          //     type="movie"
          //     query={query}
          //     searchedMovies={searchedMovies}
          //   />
          // </Suspense>
          <DynamicListPage
            type="movie"
            query={query}
            searchedMovies={searchedMovies}
          />
        ) : (
          <Empty title={"Movie List"} message={"검색된 결과가 없어요 ㅜ.ㅜ"} />
        ))}
      {loadedBooks && searchedBooks?.length > 0 ? (
        // <BookList />
        // <Suspense fallback={<CardListSkeleton arrayRows={[0, 1]} />}>
        //   <ListComponent
        //     type="book"
        //     query={query}
        //     searchedBooks={searchedBooks}
        //   />
        // </Suspense>
        <DynamicListPage
          type="book"
          query={query}
          searchedBooks={searchedBooks}
        />
      ) : (
        <Empty title={"Book List"} message={"검색된 결과가 없어요 ㅜ.ㅜ"} />
      )}
    </div>
  );
};

export default List;
