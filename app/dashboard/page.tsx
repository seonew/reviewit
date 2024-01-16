import dynamic from "next/dynamic";
import { getProducts } from "./products/api/route";

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const { products } = await getData();
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage products={products} />;
}

async function getData() {
  const startNumber = 1;
  const displayCount = 10;

  const { products } = await getProducts(startNumber, displayCount);

  return {
    products,
  };
}
