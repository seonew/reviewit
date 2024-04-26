import {
  getTotalItems,
  numberWithCommas,
  replaceCaretWithComma,
  replaceDateFormat8Digits,
} from "@/utils/common";
import {
  DETAIL_BOOK_PATH,
  DETAIL_MOVIE_PATH,
  ERROR_500_MESSAGE,
  MOVIE_API_URL,
  MOVIE_BASE_URL,
} from "@/utils/constants";
import {
  BookProps,
  LikedBook,
  LikedContent,
  MovieApiResponse,
  MovieProps,
} from "@/types";
import { NextResponse } from "next/server";
import { getUserBookmarks, getUserId } from "@/app/api/common";
import { NotFoundContentError } from "@/utils/error";

export async function GET(
  request: Request,
  { params }: { params: { query: string } }
) {
  try {
    const query = params.query;
    if (!query) {
      throw new NotFoundContentError();
    }
    const displayCount: number = 10;
    const pageParam = "1";
    const startNumber = (parseInt(pageParam) - 1) * 20 + 1;

    const booksResult = await getBooks(query, startNumber, displayCount);
    const moviesResult = await getMovies(query, 1, displayCount);

    return NextResponse.json({ booksResult, moviesResult });
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: ERROR_500_MESSAGE }, { status: 500 });
}

export const getMovies = async (
  query: string,
  page: number,
  displayCount: number
) => {
  const movieApiKey = process.env.MOVIE_READONLY_API_KEY;
  const url = `${MOVIE_API_URL}/search/movie?query=${encodeURI(
    query
  )}&language=ko-KR&include_adult=false&page=${page}`;
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${movieApiKey}`,
    },
  };
  const response = await fetch(url, options);
  const data = await response.json();

  const dataResult: MovieApiResponse[] = data.results;
  const searchMoviesResult: MovieApiResponse[] = dataResult.filter(
    (item) => item.release_date !== undefined
  );
  const total = searchMoviesResult.length;

  const count =
    searchMoviesResult.length < 10 ? searchMoviesResult.length : displayCount;
  const nextSearchMovieResult = searchMoviesResult.slice(0, count);

  const movies = nextSearchMovieResult.map((movie: MovieApiResponse) => {
    return {
      id: movie.id,
      title: movie.title,
      description: movie.overview,
      releaseDate: movie.release_date,
      posterImage:
        movie.poster_path !== null
          ? `${MOVIE_BASE_URL}/t/p/w440_and_h660_face${movie.poster_path}`
          : undefined,
      link: `${DETAIL_MOVIE_PATH}/${movie.id}`,
      average: movie.vote_average,
      adult: movie.adult ?? false,
    };
  });

  return { movies, total, limit: displayCount };
};

export const getBooks = async (
  query: string,
  startNumber: number,
  displayCount: number
) => {
  const client_id = process.env.CLIENT_ID ?? "";
  const client_secret = process.env.CLIENT_SECRET ?? "";
  const bookRequestUrl = "https://openapi.naver.com/v1/search/book?query=";
  const headers = {
    "X-Naver-Client-Id": client_id,
    "X-Naver-Client-Secret": client_secret,
  };
  const display = `&display=${displayCount}`;
  const start = `&start=${startNumber}`;

  const bookResponse = await fetch(
    `${bookRequestUrl}${encodeURI(query)}${display}${start}`,
    {
      headers,
    }
  );
  const bookData = await bookResponse.json();
  const total = getTotalItems(bookData.total);

  let bookmarks: LikedContent[] | null = null;
  try {
    await getUserId();
    bookmarks = await getUserBookmarks("book");
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.name);
    }
  }

  const books = bookData.items;
  const booksResult: LikedBook[] = books.map((book: BookProps) => {
    const bookmark = bookmarks?.find((bookmark) => bookmark.id === book.isbn);
    const checked = !!bookmark;

    const result: LikedBook = {
      title: book.title,
      author: replaceCaretWithComma(book.author),
      discount: numberWithCommas(parseInt(book.discount)),
      image: book.image,
      link: `${DETAIL_BOOK_PATH}/${book.isbn}`,
      isbn: book.isbn,
      publisher: book.publisher,
      description: book.description,
      catalogLink: book.link,
      pubdate: replaceDateFormat8Digits(book.pubdate),
      checked,
    };
    return result;
  });

  return {
    books: booksResult,
    total,
    limit: displayCount,
  };
};
