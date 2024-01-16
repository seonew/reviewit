import dynamic from "next/dynamic";
import {
  numberWithCommas,
  replaceCaretWithComma,
  replaceDateFormat8Digits,
} from "@/utils/common";
import { LikedBook } from "@/types";
import { isBookmarked, loadBookInfo } from "@/app/api/common";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const book = await getData(id);

  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage id={id} book={book} />;
}

const getData = async (id: string) => {
  const bookData = await loadBookInfo(id);
  const book = bookData.items[0];

  if (!book) {
    notFound();
  }

  const checked = await isBookmarked("book", id);
  const result: LikedBook = {
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
    checked,
  };

  return result;
};
