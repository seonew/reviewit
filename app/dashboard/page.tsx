import dynamic from "next/dynamic";
import { getProducts } from "./products/api/route";
import { getBooks } from "./books/api/route";

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
  const startNumber = 1;
  const displayCount = 10;

  try {
    const { books } = await getBooks(startNumber, displayCount);
    const { products } = await getProducts(startNumber, displayCount);

    return {
      books,
      products,
    };
  } catch (e) {
    console.error(e);
    return {
      books: null,
      products: null,
    };
  }
}
