import dynamic from "next/dynamic";
import { getBooks } from "./api/route";

export default async function Page() {
  const { total, limit } = await getData();
  const DynamicListPage = dynamic(() => import("./list-page"), { ssr: false });
  return <DynamicListPage total={total} limit={limit} />;
}

async function getData() {
  const startNumber = 1;
  const displayCount = 20;

  const result = await getBooks(startNumber, displayCount);
  return result;
}
