import { getUserId } from "@/app/api/common";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export default async function Page() {
  let userId = null;
  try {
    userId = await getUserId();
  } catch (error) {}

  if (!userId) {
    notFound();
  }

  const DynamicListPage = dynamic(() => import("./list-page"), { ssr: false });
  return <DynamicListPage />;
}