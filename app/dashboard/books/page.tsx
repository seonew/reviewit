import {
  getTotalItems,
  numberWithCommas,
  replaceCaretWithComma,
  replaceDateFormat8Digits,
} from "@/utils/common";
import { BookProps } from "@/utils/types";
import dynamic from "next/dynamic";

export default async function Page() {
  const { books, total, limit } = await getData("");
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage books={books} total={total} limit={limit} />;
}

async function getData(query: string) {
  try {
    const client_id = process.env.CLIENT_ID || "";
    const client_secret = process.env.CLIENT_SECRET || "";
    const bookRequestUrl = "https://openapi.naver.com/v1/search/book?query=";
    const headers = {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    };
    query = "사람";
    const display = "&display=20";
    const start = "&start=1";

    const bookResponse = await fetch(
      `${bookRequestUrl}${encodeURI(query)}${display}${start}`,
      {
        headers,
      }
    );
    const bookData = await bookResponse.json();
    const total = getTotalItems(bookData.total);

    const books = bookData.items;
    const booksResult: BookProps[] = books.map((book: BookProps) => {
      const result: BookProps = {
        title: book.title,
        author: replaceCaretWithComma(book.author),
        discount: numberWithCommas(parseInt(book.discount)),
        image: book.image,
        link: `/dashboard/books/${book.isbn}`,
        isbn: book.isbn,
        publisher: book.publisher,
        description: book.description,
        catalogLink: book.link,
        pubdate: replaceDateFormat8Digits(book.pubdate),
      };
      return result;
    });

    return {
      books: booksResult,
      total: total,
      limit: 20,
    };
  } catch (e) {
    console.error(e);
    return {
      books: null,
      total: 0,
      limit: 10,
    };
  }
}
