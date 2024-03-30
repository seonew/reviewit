import { getMyReviews } from "@/app/api/common";
import { LOGO } from "@/utils/constants";
import { Metadata } from "next";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: `내가 작성한 리뷰 | ${LOGO}`,
};

export default async function Page() {
  const data = await getData();
  if (!data) {
    notFound();
  }

  const DynamicListPage = dynamic(() => import("./list-page"), {
    ssr: false,
  });
  return <DynamicListPage myReiviewsApiData={data} />;
}

async function getData() {
  try {
    const { reviews, count } = await getMyReviews(1);
    return { reviews, count };
  } catch (error) {
    console.log(error);
  }
}
