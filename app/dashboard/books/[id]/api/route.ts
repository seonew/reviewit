import { NextResponse } from "next/server";
import { BookProps } from "@/utils/types";
import {
  numberWithCommas,
  replaceCaretWithComma,
  replaceDateFormat8Digits,
} from "@/utils/common";

export async function GET(
  reqeust: Request,
  { params }: { params: { id: string } }
) {
  try {
    const d_isbn = params.id;
    const client_id = process.env.CLIENT_ID || "";
    const client_secret = process.env.CLIENT_SECRET || "";
    const bookRequestUrl =
      "https://openapi.naver.com/v1/search/book_adv?d_isbn=";
    const headers = {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    };

    const bookResponse = await fetch(`${bookRequestUrl}${d_isbn}`, {
      headers,
    });
    const bookData = await bookResponse.json();
    const book = bookData.items[0];

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

    return NextResponse.json(result);
  } catch (e) {
    console.error(e);
  }
  return NextResponse.json({ error: "Internal Server Error", status: 500 });
}
