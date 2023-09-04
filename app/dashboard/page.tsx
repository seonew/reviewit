import {
  numberWithCommas,
  replaceBTagsWithEmptyString,
  replaceCaretWithComma,
  replaceDateFormat8Digits,
} from "@/utils/common";
import { BookProps, ProductProps } from "@/utils/types";
import dynamic from "next/dynamic";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { products, books } = await getData("");
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage products={products} books={books} />;
}

async function getData(query: string) {
  try {
    const client_id = process.env.CLIENT_ID || "";
    const client_secret = process.env.CLIENT_SECRET || "";
    const bookRequestUrl = "https://openapi.naver.com/v1/search/book?query=";
    const shopRequestUrl = "https://openapi.naver.com/v1/search/shop?query=";
    const headers = {
      "X-Naver-Client-Id": client_id,
      "X-Naver-Client-Secret": client_secret,
    };
    query = "사람";

    const bookResponse = await fetch(`${bookRequestUrl}${encodeURI(query)}`, {
      headers,
    });
    const bookData = await bookResponse.json();

    const books = bookData.items;
    const booksResult = books.map((book: BookProps) => {
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

    const shopResponse = await fetch(`${shopRequestUrl}${encodeURI(query)}`, {
      headers,
    });
    const productData = await shopResponse.json();

    const products = productData.items;
    const productsResult = products.map(
      (product: {
        title: string;
        image: string;
        link: string;
        lprice: string;
        brand: string;
        productId: string;
        mallName: string;
        maker: string;
        productType: string;
        category1: string;
        category2: string;
        category3: string;
        category4: string;
      }) => {
        const result: ProductProps = {
          title: replaceBTagsWithEmptyString(product.title),
          brand: replaceCaretWithComma(product.brand),
          lprice: numberWithCommas(parseInt(product.lprice)),
          image: product.image,
          link: `/dashboard/products/${product.productId}`,
          mall: product.mallName,
          maker: product.maker,
          productId: product.productId,
          productType: product.productType,
          category: `${product.category1} > ${product.category2} > ${product.category3} > ${product.category4}`,
        };
        return result;
      }
    );

    return {
      books: booksResult,
      products: productsResult,
    };
  } catch (e) {
    console.error(e);
    return {
      books: null,
      products: null,
    };
  }
}
