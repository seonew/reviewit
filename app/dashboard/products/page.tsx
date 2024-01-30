import { getProducts } from "@/app/api/dashboard/products/route";
import dynamic from "next/dynamic";

export default async function Page() {
  const { total, limit } = await getData();
  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage total={total} limit={limit} />;
}

async function getData() {
  const startNumber = 1;
  const displayCount = 20;

  try {
    const result = await getProducts(startNumber, displayCount);
    return result;
  } catch (e) {
    console.error(e);
    return {
      total: 0,
      limit: displayCount,
    };
  }
}
