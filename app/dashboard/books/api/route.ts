import {
  getTotalItems,
  numberWithCommas,
  replaceCaretWithComma,
} from "@/utils/common";
import { BookProps } from "@/utils/types";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageParam = searchParams.get("page") ?? "1";
    let startNumber = (parseInt(pageParam) - 1) * 20 + 1;

    const client_id = process.env.CLIENT_ID || "";
    const client_secret = process.env.CLIENT_SECRET || "";
    const bookRequestUrl = "https://openapi.naver.com/v1/search/book?query=";
    const headers = {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    };
    const query = "사람";
    const display = "&display=20";
    const start = `&start=${startNumber}`;

    const bookResponse = await fetch(
      `${bookRequestUrl}${encodeURI(query)}${display}${start}`,
      {
        headers,
      }
    );
    const bookData = await bookResponse.json();
    const total = getTotalItems(bookData.total);

    const books = bookData.items;
    const booksResult = books.map((book: BookProps) => {
      const result: BookProps = {
        title: book.title,
        author: replaceCaretWithComma(book.author),
        discount: numberWithCommas(parseInt(book.discount)),
        image: book.image,
        link: book.link,
        isbn: book.isbn,
        publisher: book.publisher,
        description: book.description,
      };
      return result;
    });

    const result = {
      books: booksResult,
      total,
      limit: 20,
    };

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
}
