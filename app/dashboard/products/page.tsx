import dynamic from "next/dynamic";
import { getProducts } from "./api/route";

export default async function Page() {
  const { products, total, limit } = await getData("");
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage products={products} total={total} limit={limit} />;
}

async function getData(query: string) {
  const startNumber = 1;
  const displayCount = 20;

  try {
    const result = await getProducts(startNumber, displayCount);
    return result;
  } catch (e) {
    console.error(e);
    return {
      products: null,
      total: 0,
      limit: displayCount,
    };
  }
}
