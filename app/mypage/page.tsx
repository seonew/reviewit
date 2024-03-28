import dynamic from "next/dynamic";
import { getUserId } from "../api/common";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { LOGO } from "@/utils/constants";

export const metadata: Metadata = {
  title: `마이페이지 | ${LOGO}`,
};

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
