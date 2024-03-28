import { getUserId } from "@/app/api/common";
import { LOGO } from "@/utils/constants";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: `회원정보수정 | ${LOGO}`,
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
