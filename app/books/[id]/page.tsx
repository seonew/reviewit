import dynamic from "next/dynamic";
import {
  numberWithCommas,
  replaceCaretWithComma,
  replaceDateFormat8Digits,
} from "@/utils/common";
import { LikedBook } from "@/types";
import { loadBookInfo } from "@/app/api/common";
import { notFound } from "next/navigation";
import {
  DETAIL_BOOK_PATH,
  ERROR_PAGE_404_MESSAGE,
  LOGO,
} from "@/utils/constants";
import { Metadata } from "next";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const book = await getData(id);
  let title = "";

  if (!book) {
    title = `${ERROR_PAGE_404_MESSAGE}`;
  } else {
    title = `${book.title} | ${LOGO}`;
  }

  return {
    title,
  };
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  const book = await getData(id);

  if (!book) {
    notFound();
  }

  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage id={id} book={book} />;
}

const getData = async (id: string) => {
  const bookData = await loadBookInfo(id);
  const book = bookData.items[0];

  if (!book) {
    return null;
  }

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
  };

  return result;
};
