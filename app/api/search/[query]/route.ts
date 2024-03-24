import {
  getTotalItems,
  numberWithCommas,
  replaceCaretWithComma,
  replaceDateFormat8Digits,
} from "@/utils/common";
import {
  DETAIL_BOOK_PATH,
  DETAIL_MOVIE_PATH,
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
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
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

  const searchMoviesResult = data.results;
  const total = data.total_results;

  let movies: MovieProps[] = [];
  if (displayCount === 10) {
    for (let i = 0; i < displayCount; i++) {
      const movie: MovieProps = {
        id: searchMoviesResult[i].id,
        title: searchMoviesResult[i].title,
        description: searchMoviesResult[i].overview,
        releaseDate: searchMoviesResult[i].release_date,
        posterImage:
          searchMoviesResult[i].poster_path !== null
            ? `${MOVIE_BASE_URL}/t/p/w440_and_h660_face${searchMoviesResult[i].poster_path}`
            : undefined,
        link: `${DETAIL_MOVIE_PATH}/${searchMoviesResult[i].id}`,
        average: searchMoviesResult[i].vote_average,
        adult: false,
      };
      movies.push(movie);
    }
  } else {
    movies = searchMoviesResult.map((movie: MovieApiResponse) => {
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
      };
    });
  }

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
  } catch (err) {}

  const books = bookData.items;
  const booksResult: LikedBook[] = books.map((book: BookProps) => {
    const bookmark = bookmarks?.find((bookmark) => bookmark.id === book.isbn);
    const checked = !bookmark ? false : true;

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
